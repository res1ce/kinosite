"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getLocations() {
  return await prisma.location.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createLocation(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));
  const address = String(formData.get("address") || "").trim() || null;
  const slug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  let galleryUrls = null;
  const galleryUrlsStr = formData.get("galleryUrls");
  const category = formData.get("category") as string;
  if (typeof galleryUrlsStr === 'string') {
    try {
      galleryUrls = JSON.parse(galleryUrlsStr);
    } catch {
      galleryUrls = null;
    }
  }
  
  if (!name || Number.isNaN(latitude) || Number.isNaN(longitude)) return;
  
  await prisma.location.create({ 
    data: { 
      name,  
      latitude, 
      longitude,
      slug, 
      address,
      description,
      galleryUrls,
      category,
    } 
  });

  revalidatePath("/admin/locations");
  revalidatePath("/locations");
}

export async function updateLocation(id: string, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));
  const address = String(formData.get("address") || "").trim() || null;
  const slug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = formData.get("category") as string;
  let galleryUrls = null;
  const galleryUrlsStr = formData.get("galleryUrls");
  if (typeof galleryUrlsStr === 'string') {
    try {
      galleryUrls = JSON.parse(galleryUrlsStr);
    } catch {
      galleryUrls = null;
    }
  }
  
  if (!name || Number.isNaN(latitude) || Number.isNaN(longitude)) return;
  
  await prisma.location.update({
    where: { id },
    data: {
      name,
      latitude,
      longitude,
      slug,
      address,
      description,
      galleryUrls,
      category,
    }
  });

  revalidatePath("/admin/locations");
  revalidatePath("/locations");
}

export async function deleteLocation(id: string) {
  await prisma.location.delete({ 
    where: { id } 
  });
  
  revalidatePath("/admin/locations");
  revalidatePath("/locations");
}
