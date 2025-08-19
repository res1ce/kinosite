import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const location = await prisma.location.findUnique({
    where: {
      id: params.slug
    }
  })

  if (!location) {
    return new NextResponse('Not Found', { status: 404 })
  }

  return NextResponse.json(location)
}
