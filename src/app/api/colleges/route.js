import { NextResponse } from 'next/server';
import { z } from 'zod';
const prisma = require('@/lib/prisma');

const querySchema = z
  .object({
    search: z.string().trim().max(100).optional(),
    location: z.string().trim().max(100).optional(),
    type: z.enum(['Government', 'Private', 'Deemed']).optional(),
    minFees: z.coerce.number().min(0).optional(),
    maxFees: z.coerce.number().min(0).optional(),
    minRating: z.coerce.number().min(0).max(5).optional(),
    maxRating: z.coerce.number().min(0).max(5).optional(),
    sort: z.enum(['fees_asc', 'fees_desc', 'rating_asc', 'rating_desc']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  })
  .strict();

function errorResponse(code, message, status, details) {
  return NextResponse.json(
    { error: { code, message, ...(details && { details }) } },
    { status }
  );
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const raw = Object.fromEntries(searchParams.entries());

    const parsed = querySchema.safeParse(raw);
    if (!parsed.success) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Query parameters failed validation',
        400,
        parsed.error.flatten()
      );
    }

    const {
      search,
      location,
      type,
      minFees,
      maxFees,
      minRating,
      maxRating,
      sort,
      page,
      limit,
    } = parsed.data;

    if (minFees !== undefined && maxFees !== undefined && minFees > maxFees) {
      return errorResponse('INVALID_RANGE', 'minFees cannot be greater than maxFees', 400);
    }
    if (minRating !== undefined && maxRating !== undefined && minRating > maxRating) {
      return errorResponse('INVALID_RANGE', 'minRating cannot be greater than maxRating', 400);
    }

    const where = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }
    if (type) {
      where.type = type;
    }
    if (minFees !== undefined || maxFees !== undefined) {
      where.fees = {};
      if (minFees !== undefined) where.fees.gte = minFees;
      if (maxFees !== undefined) where.fees.lte = maxFees;
    }
    if (minRating !== undefined || maxRating !== undefined) {
      where.rating = {};
      if (minRating !== undefined) where.rating.gte = minRating;
      if (maxRating !== undefined) where.rating.lte = maxRating;
    }

    let orderBy = [{ id: 'asc' }];
    if (sort === 'fees_asc') orderBy = [{ fees: 'asc' }, { id: 'asc' }];
    if (sort === 'fees_desc') orderBy = [{ fees: 'desc' }, { id: 'asc' }];
    if (sort === 'rating_asc') orderBy = [{ rating: 'asc' }, { id: 'asc' }];
    if (sort === 'rating_desc') orderBy = [{ rating: 'desc' }, { id: 'asc' }];

    const skip = (page - 1) * limit;

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({ where, orderBy, skip, take: limit }),
      prisma.college.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      data: colleges,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
      },
    });
  } catch (err) {
    console.error('[GET /api/colleges]', err);
    return errorResponse('INTERNAL_ERROR', 'Something went wrong on our end', 500);
  }
}