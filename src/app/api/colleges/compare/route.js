import { NextResponse } from 'next/server';
import { z } from 'zod';
const prisma = require('@/lib/prisma');

const bodySchema = z.object({
  ids: z
    .array(z.number().int().positive())
    .min(2, { message: 'At least 2 college IDs required' })
    .max(3, { message: 'Maximum 3 colleges can be compared' }),
});

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // duplicate IDs reject karo
    const uniqueIds = [...new Set(parsed.data.ids)];
    if (uniqueIds.length !== parsed.data.ids.length) {
      return NextResponse.json(
        { error: 'Duplicate college IDs are not allowed' },
        { status: 400 }
      );
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: uniqueIds } },
      include: {
        courses: true,
        placements: { orderBy: { year: 'desc' }, take: 1 }, // latest year only
      },
    });

    // check karo koi ID missing toh nahi
    const foundIds = colleges.map((c) => c.id);
    const missingIds = uniqueIds.filter((id) => !foundIds.includes(id));
    if (missingIds.length > 0) {
      return NextResponse.json(
        { error: `College(s) not found: ${missingIds.join(', ')}` },
        { status: 404 }
      );
    }

    // structured comparison banate hain
    const comparison = colleges.map((c) => ({
      id: c.id,
      name: c.name,
      location: c.location,
      fees: c.fees,
      rating: c.rating,
      type: c.type,
      totalCourses: c.courses.length,
      latestPlacement: c.placements[0]
        ? {
            year: c.placements[0].year,
            avgPackage: c.placements[0].avgPackage,
            highestPackage: c.placements[0].highestPackage,
          }
        : null,
    }));

    return NextResponse.json({ data: comparison });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}