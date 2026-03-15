import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

/**
 * Extracts the public ID from a Cloudinary URL and deletes the asset from Cloudinary.
 * Does nothing if the URL is not a valid Cloudinary URL or is a base64 string.
 */
export async function deleteImage(url?: string | null) {
  if (!url || !url.includes("cloudinary.com")) return;
  try {
    // Match "upload/" optionally followed by a version (e.g. "v123456/"), then capture the public ID until the file extension
    const regex = /\/upload\/(?:v\d+\/)?([^\.]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error("Failed to delete image from Cloudinary for URL:", url, error);
  }
}
