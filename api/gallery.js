import { del, list, put } from "@vercel/blob";
import { defaultGallery, normalizeGallery, normalizeServices, slugifyCategory } from "../src/galleryData.js";
import { isAuthenticated, requireAdmin } from "./_auth.js";

const MANIFEST_PATH = "gallery/manifest.json";
const IMAGE_PREFIX = "gallery/images";

function hasBlobConfig() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readManifest() {
  if (!hasBlobConfig()) {
    return {
      categories: normalizeGallery(defaultGallery),
      services: [],
      usingFallback: true,
      storageConfigured: false,
    };
  }

  const result = await list({ prefix: MANIFEST_PATH, limit: 1 });
  const manifestBlob = result.blobs.find((blob) => blob.pathname === MANIFEST_PATH);

  if (!manifestBlob) {
    return {
      categories: normalizeGallery(defaultGallery),
      services: [],
      usingFallback: true,
      storageConfigured: true,
    };
  }

  const response = await fetch(manifestBlob.url, { cache: "no-store" });
  if (!response.ok) throw new Error("Could not read gallery manifest.");

  const manifest = await response.json();
  return {
    categories: normalizeGallery(manifest.categories),
    services: normalizeServices(manifest.services),
    usingFallback: false,
    storageConfigured: true,
  };
}

async function writeManifest(categories, services) {
  const manifest = {
    version: 2,
    updatedAt: new Date().toISOString(),
    categories: normalizeGallery(categories),
    services: normalizeServices(services),
  };

  await put(MANIFEST_PATH, JSON.stringify(manifest, null, 2), {
    access: "public",
    allowOverwrite: true,
    contentType: "application/json",
  });

  return manifest;
}

function dataUrlToBuffer(dataUrl) {
  const match = /^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/i.exec(String(dataUrl || ""));
  if (!match) throw new Error("Upload must be a normalized image data URL.");

  return {
    contentType: match[1].toLowerCase() === "image/jpg" ? "image/jpeg" : match[1].toLowerCase(),
    buffer: Buffer.from(match[2], "base64"),
  };
}

function findBlobUrls(categories, imageId) {
  const urls = [];
  for (const category of categories) {
    for (const item of category.items || []) {
      if (item.id === imageId && item.source === "blob" && item.src) {
        urls.push(item.src);
      }
    }
  }
  return urls;
}

async function handleUpload(req, res) {
  if (!hasBlobConfig()) {
    res.status(503).json({ error: "Blob storage is not configured." });
    return;
  }

  const { categories, services } = await readManifest();
  const categoryId = slugifyCategory(req.body?.categoryId);
  const category = categories.find((item) => item.id === categoryId);
  if (!category) {
    res.status(400).json({ error: "Unknown category." });
    return;
  }

  const { buffer, contentType } = dataUrlToBuffer(req.body?.image);
  if (buffer.length > 4 * 1024 * 1024) {
    res.status(413).json({ error: "Image is too large after normalization." });
    return;
  }

  const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const extension = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const blob = await put(`${IMAGE_PREFIX}/${id}.${extension}`, buffer, {
    access: "public",
    contentType,
  });

  category.items.unshift({
    id,
    src: blob.url,
    alt: String(req.body?.alt || `${category.label} hairstyle example`).trim(),
    source: "blob",
  });

  const manifest = await writeManifest(categories, services);
  res.status(200).json(manifest);
}

async function handleSave(req, res) {
  if (!hasBlobConfig()) {
    res.status(503).json({ error: "Blob storage is not configured." });
    return;
  }

  const current = await readManifest();
  const manifest = await writeManifest(req.body?.categories, req.body?.services ?? current.services);
  res.status(200).json(manifest);
}

async function handleDelete(req, res) {
  if (!hasBlobConfig()) {
    res.status(503).json({ error: "Blob storage is not configured." });
    return;
  }

  const imageId = String(req.body?.imageId || "");
  if (!imageId) {
    res.status(400).json({ error: "Missing imageId." });
    return;
  }

  const { categories, services } = await readManifest();
  const blobUrls = findBlobUrls(categories, imageId);
  const updatedCategories = categories.map((category) => ({
    ...category,
    items: category.items.filter((item) => item.id !== imageId),
  }));

  if (blobUrls.length) {
    await del(blobUrls);
  }

  const manifest = await writeManifest(updatedCategories, services);
  res.status(200).json(manifest);
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const manifest = await readManifest();
      res.status(200).json({
        ...manifest,
        authenticated: isAuthenticated(req),
      });
      return;
    }

    if (!requireAdmin(req, res)) return;

    if (req.method === "PUT") {
      await handleSave(req, res);
      return;
    }

    if (req.method === "POST") {
      await handleUpload(req, res);
      return;
    }

    if (req.method === "DELETE") {
      await handleDelete(req, res);
      return;
    }

    res.setHeader("Allow", "GET, PUT, POST, DELETE");
    res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Gallery request failed." });
  }
}
