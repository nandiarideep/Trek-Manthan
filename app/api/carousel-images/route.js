import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { connectDB } from '@/lib/db';
import CarouselImage from '@/models/carouselImages.model';

const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'carousel');

async function ensureUploadDir() {
  await fs.mkdir(uploadDir, { recursive: true });
}

function safeFileName(name) {
  const base = path.basename(name || 'carousel-image').replace(/[^a-zA-Z0-9._-]/g, '-');
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${base}`;
}

export async function GET() {
  try {
    await connectDB();

    const items = await CarouselImage.find({ active: true }).sort({ id: 1, createdAt: 1 }).lean();

    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to load carousel images:', error);
    return NextResponse.json({ message: 'Failed to load carousel images' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const files = [
      ...formData.getAll('image').filter((file) => file instanceof File && file.size > 0),
      ...formData.getAll('destinationImages').filter((file) => file instanceof File && file.size > 0),
    ];

    const metaRaw = formData.get('destinationImageMeta') || formData.get('meta');
    let metadata = [];

    if (typeof metaRaw === 'string') {
      try {
        const parsed = JSON.parse(metaRaw);
        if (Array.isArray(parsed)) metadata = parsed;
      } catch {
        // ignore invalid metadata and continue with default values
      }
    }

    if (!files.length) {
      return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
    }

    const savedItems = [];

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const currentMeta = metadata[i] || {};
      const rawTitle = currentMeta.title ?? formData.get('title') ?? '';
      const rawDesc = currentMeta.desc ?? formData.get('desc') ?? '';
      const rawId = currentMeta.id ?? formData.get('id') ?? Date.now() + i;
      const parsedId = Number(rawId);

      if (!Number.isFinite(parsedId)) {
        return NextResponse.json({ message: 'Valid image id is required' }, { status: 400 });
      }

      const title = typeof rawTitle === 'string' ? rawTitle.trim() : '';
      const desc = typeof rawDesc === 'string' ? rawDesc.trim() : '';

      const buffer = Buffer.from(await file.arrayBuffer());
      const extension = path.extname(file.name) || '.png';
      const fileName = safeFileName(file.name || `carousel-${parsedId}${extension}`);

      await ensureUploadDir();
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);

      const imageUrl = `/uploads/carousel/${fileName}`;

      const existing = await CarouselImage.findOne({ id: parsedId }).lean();
      if (existing) {
        const fileToDelete = path.join(process.cwd(), 'public', existing.image);
        await fs.unlink(fileToDelete).catch(() => {});
        await CarouselImage.findByIdAndDelete(existing._id);
      }

      const item = await CarouselImage.create({
        id: parsedId,
        title,
        desc,
        image: imageUrl,
        active: true,
      });

      savedItems.push(item);
    }

    return NextResponse.json(savedItems, { status: 201 });
  } catch (error) {
    console.error('Failed to create carousel image:', error);
    return NextResponse.json({ message: 'Failed to create carousel image' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Image id is required' }, { status: 400 });
    }

    await connectDB();

    const item = await CarouselImage.findOne({ $or: [{ _id: id }, { id: Number(id) }] }).lean();
    if (!item) {
      return NextResponse.json({ message: 'Carousel image not found' }, { status: 404 });
    }

    if (item.image) {
      const filePath = path.join(process.cwd(), 'public', item.image);
      await fs.unlink(filePath).catch(() => {});
    }

    await CarouselImage.deleteOne({ _id: item._id });

    return NextResponse.json({ message: 'Carousel image deleted successfully' });
  } catch (error) {
    console.error('Failed to delete carousel image:', error);
    return NextResponse.json({ message: 'Failed to delete carousel image' }, { status: 500 });
  }
}
