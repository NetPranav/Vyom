// app/actions/upload.ts
"use server";

import { put } from "@vercel/blob";

export async function uploadImage(formData: FormData) {
  const imageFile = formData.get("file") as File;
  
  if (!imageFile) {
    throw new Error("No file uploaded");
  }

  // Upload to your "vyom-blob-images" store
  // access: 'public' means anyone can view the image URL (required for your app)
  const blob = await put(imageFile.name, imageFile, {
    access: "public",
  });

  // Return the public URL (e.g., https://k9d...vercel.app/image.jpg)
  return blob.url; 
}