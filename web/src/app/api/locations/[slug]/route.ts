import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  const location = await prisma.location.findUnique({
    where: {
      slug: slug
    }
  })

  if (!location) {
    return new NextResponse('Not Found', { status: 404 })
  }

  return NextResponse.json(location)
}