import { NextResponse } from 'next/server';
const prisma = require('@/lib/prisma');

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const collegeId = Number(id);

    // validate ki id ek valid number hai
    if (!Number.isInteger(collegeId) || collegeId <= 0) {
      return NextResponse.json(
        { error: 'Invalid college ID' },
        { status: 400 }
      );
    }

    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      include: {
        courses: true,
        placements: { orderBy: { year: 'desc' } },
        reviews: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!college) {
      return NextResponse.json(
        { error: 'College not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: college });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}