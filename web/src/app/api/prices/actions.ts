"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPriceItems() {
  return await prisma.priceItem.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createPriceItem(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  
  if (!name) return;
  
  await prisma.priceItem.create({
    data: {
      name,
      description,
    }
  });
  
  revalidatePath("/prices");
  revalidatePath("/admin/prices");
}

export async function updatePriceItem(id: string, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  
  if (!name) return;
  
  await prisma.priceItem.update({
    where: { id },
    data: {
      name,
      description,
    }
  });
  
  revalidatePath("/prices");
  revalidatePath("/admin/prices");
}

export async function deletePriceItem(id: string) {
  await prisma.priceItem.delete({
    where: { id }
  });
  
  revalidatePath("/prices");
  revalidatePath("/admin/prices");
}
