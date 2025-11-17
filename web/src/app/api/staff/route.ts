import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: получить всех участников команды
export async function GET() {
  try {
    const staffMembers = await prisma.staffMember.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(staffMembers);
  } catch (error) {
    console.error("Error fetching staff members:", error);
    return NextResponse.json({ error: "Failed to fetch staff members" }, { status: 500 });
  }
}

// POST: создать нового участника команды
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, photo, description } = body;

    if (!name || !role || !description) {
      return NextResponse.json(
        { error: "Name, role, and description are required" },
        { status: 400 }
      );
    }

    // Получаем максимальный order для правильной сортировки
    const lastMember = await prisma.staffMember.findFirst({
      orderBy: { order: 'desc' }
    });
    const newOrder = lastMember ? lastMember.order + 1 : 0;

    const staffMember = await prisma.staffMember.create({
      data: {
        name,
        role,
        photo: photo || null,
        description,
        order: newOrder
      }
    });

    return NextResponse.json(staffMember, { status: 201 });
  } catch (error) {
    console.error("Error creating staff member:", error);
    return NextResponse.json({ error: "Failed to create staff member" }, { status: 500 });
  }
}

// DELETE: удалить участника команды
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.staffMember.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting staff member:", error);
    return NextResponse.json({ error: "Failed to delete staff member" }, { status: 500 });
  }
}


