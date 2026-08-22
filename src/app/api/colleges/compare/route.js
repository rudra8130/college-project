import { NextResponse } from 'next/server';
import { z } from 'zod';
const prisma = require('@/lib/prisma');

const bodySchema = z
  .object({
    ids: z
      .array(z.coerce.number().int().positive())
      .min(2, { message: 'At least 2 college IDs are required to compare' })
      .max(3, { message: 'You can compare at most 3 colleges at a time' }),
  })
  .strict();

function errorResponse(code, message, status, details) {
  return NextResponse.json(
    { error: { code, message, ...(details && { details }) } },
    { status }
  );
}

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse('INVALID_JSON', 'Request body must be valid JSON', 400);
    }

    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Request failed validation',
        400,
        parsed.error.flatten()
      );
    }

    const uniqueIds = [...new Set(parsed.data.ids)];
    if (uniqueIds.length !== parsed.data.ids.length) {
      return errorResponse(
        'DUPLICATE_IDS',
        'Duplicate college IDs are not allowed in a single comparison',
        400
      );
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: uniqueIds } },
      select: {
        id: true,
        name: true,
        location: true,
        fees: true,
        rating: true,
        type: true,
        image: true,
        _count: { select: { courses: true } },
        placements: {
          orderBy: { year: 'desc' },
          take: 1,
          select: { year: true, avgPackage: true, highestPackage: true, companies: true },
        },
      },
    });

    const foundIds = colleges.map((c) => c.id);
    const missingIds = uniqueIds.filter((id) => !foundIds.includes(id));
    if (missingIds.length > 0) {
      return errorResponse(
        'NOT_FOUND',
        `College(s) not found: ${missingIds.join(', ')}`,
        404,
        { missingIds }
      );
    }

    const orderedColleges = uniqueIds.map((id) => colleges.find((c) => c.id === id));

    const comparison = orderedColleges.map((c) => ({
      id: c.id,
      name: c.name,
      location: c.location,
      fees: c.fees,
      rating: c.rating,
      type: c.type,
      image: c.image,
      totalCourses: c._count.courses,
      latestPlacement: c.placements[0]
        ? {
            year: c.placements[0].year,
            avgPackage: c.placements[0].avgPackage,
            highestPackage: c.placements[0].highestPackage,
            companies: c.placements[0].companies,
          }
        : null,
    }));

    const highlights = {
      lowestFees: pickExtreme(comparison, (c) => c.fees, 'min'),
      highestRating: pickExtreme(comparison, (c) => c.rating, 'max'),
      highestAvgPackage: pickExtreme(
        comparison,
        (c) => c.latestPlacement?.avgPackage ?? null,
        'max'
      ),
    };

    return NextResponse.json({ data: comparison, highlights });
  } catch (err) {
    console.error('[POST /api/colleges/compare]', err);
    return errorResponse('INTERNAL_ERROR', 'Something went wrong on our end', 500);
  }
}

function pickExtreme(colleges, getValue, mode) {
  let best = null;
  for (const c of colleges) {
    const value = getValue(c);
    if (value === null || value === undefined) continue;
    if (
      !best ||
      (mode === 'min' && value < best.value) ||
      (mode === 'max' && value > best.value)
    ) {
      best = { id: c.id, name: c.name, value };
    }
  }
  return best;
}