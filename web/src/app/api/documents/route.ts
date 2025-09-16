// app/api/documents/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, fileUrl } = await request.json();

    if (!title || !fileUrl) {
      return NextResponse.json(
        { error: 'Title and fileUrl are required' },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        title,
        fileUrl
      }
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}