// app/api/events/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Получаем события с пагинацией
    const [events, totalCount] = await Promise.all([
      prisma.event.findMany({
        where: {
          isPublished: true
        },
        orderBy: {
          date: 'desc' // Сортируем по дате (новые первые)
        },
        skip,
        take: limit,
      }),
      prisma.event.count({
        where: {
          isPublished: true
        }
      })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      events,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      shortDescription,
      content,
      coverImageUrl,
      galleryUrls,
      date,
      location
    } = body;

    // Проверяем обязательные поля
    if (!title || !slug || !shortDescription || !content || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, shortDescription, content, date' },
        { status: 400 }
      );
    }

    // Проверяем уникальность slug
    const existingEvent = await prisma.event.findUnique({
      where: { slug }
    });

    if (existingEvent) {
      return NextResponse.json(
        { error: 'Event with this slug already exists' },
        { status: 409 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        shortDescription,
        content,
        coverImageUrl,
        galleryUrls: galleryUrls ? JSON.stringify(galleryUrls) : undefined,
        date: new Date(date),
        location,
        isPublished: true
      }
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}