// app/actions/upload.ts
"use server";

import { put } from "@vercel/blob";

export async function uploadImage(formData: FormData) {
  const imageFile = formData.get("file") as File;
  
  if (!imageFile) {
    throw new Error("No file uploaded");
  }

  // Upload to Vercel Blob
  const blob = await put(imageFile.name, imageFile, {
    access: "public",
  });

  return blob.url; // Returns the public URL
}