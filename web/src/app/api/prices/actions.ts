"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPriceItems() {
  return await prisma.priceItem.findMany({ orderBy: { order: 'asc' } });
}

export async function createPriceItem(fd: FormData) {
  await prisma.priceItem.create({
    data: {
      name: String(fd.get("name")),
      description: String(fd.get("description") || ""),
      features: String(fd.get("features") || "[]"),
      iconType: String(fd.get("iconType") || "star"),
      order: parseInt(String(fd.get("order") || "0")),
    },
  });
  revalidatePath("/admin/prices");
  revalidatePath("/services");
}

export async function updatePriceItem(id: string, fd: FormData) {
  await prisma.priceItem.update({
    where: { id },
    data: {
      name: String(fd.get("name")),
      description: String(fd.get("description") || ""),
      features: String(fd.get("features") || "[]"),
      iconType: String(fd.get("iconType") || "star"),
      order: parseInt(String(fd.get("order") || "0")),
    },
  });
  revalidatePath("/admin/prices");
  revalidatePath("/services");
}

export async function deletePriceItem(id: string) {
  await prisma.priceItem.delete({ where: { id } });
  revalidatePath("/admin/prices");
  revalidatePath("/services");
}