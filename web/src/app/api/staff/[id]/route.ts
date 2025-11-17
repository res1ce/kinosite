import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH: обновить участника команды
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, role, photo, description } = body;

    const staffMember = await prisma.staffMember.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(role && { role }),
        ...(photo !== undefined && { photo }),
        ...(description && { description })
      }
    });

    return NextResponse.json(staffMember);
  } catch (error) {
    console.error("Error updating staff member:", error);
    return NextResponse.json({ error: "Failed to update staff member" }, { status: 500 });
  }
}

// POST: переместить участника команды (вверх/вниз)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { direction } = body;

    if (!direction || !['up', 'down'].includes(direction)) {
      return NextResponse.json({ error: "Invalid direction" }, { status: 400 });
    }

    const member = await prisma.staffMember.findUnique({ 
      where: { id: params.id } 
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (direction === 'up') {
      const prevMember = await prisma.staffMember.findFirst({
        where: { order: { lt: member.order } },
        orderBy: { order: 'desc' }
      });
      
      if (prevMember) {
        await prisma.$transaction([
          prisma.staffMember.update({
            where: { id: member.id },
            data: { order: prevMember.order }
          }),
          prisma.staffMember.update({
            where: { id: prevMember.id },
            data: { order: member.order }
          })
        ]);
      }
    } else if (direction === 'down') {
      const nextMember = await prisma.staffMember.findFirst({
        where: { order: { gt: member.order } },
        orderBy: { order: 'asc' }
      });
      
      if (nextMember) {
        await prisma.$transaction([
          prisma.staffMember.update({
            where: { id: member.id },
            data: { order: nextMember.order }
          }),
          prisma.staffMember.update({
            where: { id: nextMember.id },
            data: { order: member.order }
          })
        ]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error moving staff member:", error);
    return NextResponse.json({ error: "Failed to move staff member" }, { status: 500 });
  }
}


