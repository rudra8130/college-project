import { NextResponse } from 'next/server';
import { z } from 'zod';
const prisma = require('@/lib/prisma');

// query params ka validation schema
const querySchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  minFees: z.coerce.number().min(0).optional(),
  maxFees: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(['fees_asc', 'fees_desc', 'rating_asc', 'rating_desc']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const raw = Object.fromEntries(searchParams.entries());

    const parsed = querySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { search, location, minFees, maxFees, minRating, sort, page, limit } = parsed.data;

    // sanity check: minFees should not exceed maxFees
    if (minFees !== undefined && maxFees !== undefined && minFees > maxFees) {
      return NextResponse.json(
        { error: 'minFees cannot be greater than maxFees' },
        { status: 400 }
      );
    }

    // dynamic WHERE clause banate hain
    const where = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }
    if (minFees !== undefined || maxFees !== undefined) {
      where.fees = {};
      if (minFees !== undefined) where.fees.gte = minFees;
      if (maxFees !== undefined) where.fees.lte = maxFees;
    }
    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    // sorting
    let orderBy = { id: 'asc' }; // default
    if (sort === 'fees_asc') orderBy = { fees: 'asc' };
    if (sort === 'fees_desc') orderBy = { fees: 'desc' };
    if (sort === 'rating_asc') orderBy = { rating: 'asc' };
    if (sort === 'rating_desc') orderBy = { rating: 'desc' };

    const skip = (page - 1) * limit;

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({ where, orderBy, skip, take: limit }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({
      data: colleges,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}