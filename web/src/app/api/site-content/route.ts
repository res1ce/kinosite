// app/api/site-content/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const siteContent = await prisma.siteContent.findFirst({
      where: { slug: 'main' }
    });

    if (!siteContent) {
      return NextResponse.json(
        { error: 'Site content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(siteContent);
  } catch (error) {
    console.error('Error fetching site content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      heroText,
      feature1Number,
      feature1Label,
      feature2Number,
      feature2Label,
      feature3Number,
      feature3Label,
      footerDescription,
      footerContacts,
      contactPhone,
      contactEmail
    } = body;

    const siteContent = await prisma.siteContent.upsert({
      where: { slug: 'main' },
      create: {
        slug: 'main',
        heroText,
        feature1Number,
        feature1Label,
        feature2Number,
        feature2Label,
        feature3Number,
        feature3Label,
        footerDescription,
        footerContacts,
        contactPhone,
        contactEmail
      },
      update: {
        heroText,
        feature1Number,
        feature1Label,
        feature2Number,
        feature2Label,
        feature3Number,
        feature3Label,
        footerDescription,
        footerContacts,
        contactPhone,
        contactEmail
      }
    });

    return NextResponse.json(siteContent);
  } catch (error) {
    console.error('Error updating site content:', error);
    return NextResponse.json(
      { error: 'Failed to update site content' },
      { status: 500 }
    );
  }
}