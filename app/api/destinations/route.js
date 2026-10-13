import { NextResponse } from 'next/server';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Destination from '@/models/destination.model';

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const getBucket = () =>
    new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'destinationImages' });

const toUrl = (id) => `/api/destinations?image=${id}`;

const deleteFile = (fileId) =>
    getBucket().delete(new mongoose.Types.ObjectId(fileId)).catch(() => { });

async function uploadFile(file, uploadedIds) {
    const uploadStream = getBucket().openUploadStream(file.name, {
        metadata: { contentType: file.type || 'application/octet-stream' },
    });
    await pipeline(Readable.fromWeb(file.stream()), uploadStream);
    uploadedIds.push(uploadStream.id.toString());
    return uploadStream.id.toString();
}

// Reads + validates the multipart body shared by POST and PUT
function parseForm(body) {
    const name = String(body.get('name') || '').trim();
    if (!name) return { error: 'Destination name is required!' };
    const desc = String(body.get('desc') || '').trim();
    if (!desc) return { error: 'Destination description is required!' };

    let meta;
    try {
        meta = JSON.parse(body.get('images') || '[]');
    } catch {
        return { error: 'Invalid image data' };
    }
    if (!Array.isArray(meta) || meta.length < 1 || meta.length > MAX_IMAGES) {
        return { error: `Add 1 to ${MAX_IMAGES} images` };
    }

    const files = body.getAll('newImages').filter((f) => typeof f !== 'string' && f.size > 0);
    const newCount = meta.filter((m) => !m.fileId).length;
    if (newCount !== files.length) return { error: 'Image files do not match image details' };

    for (const f of files) {
        if (!f.type.startsWith('image/')) return { error: 'Only image files are allowed' };
        if (f.size > MAX_IMAGE_SIZE) return { error: 'Each image must be under 10MB' };
    }

    meta = meta.map((m) => ({
        fileId: m.fileId ? String(m.fileId) : null,
    }));

    return { name, desc, meta, files };
}

// Keeps existing images (fileId present) and uploads new ones, preserving order
async function buildImages({ meta, files }, uploadedIds) {
    let fileIndex = 0;
    const images = [];
    for (const item of meta) {
        const fileId = item.fileId || (await uploadFile(files[fileIndex++], uploadedIds));
        images.push({ fileId, url: toUrl(fileId) });
    }
    return images;
}

// GET /api/destinations              -> list of destinations
// GET /api/destinations?image=<id>   -> streams one image from GridFS
export async function GET(request) {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('image');

    if (imageId) {
        if (!mongoose.isValidObjectId(imageId)) {
            return NextResponse.json({ message: 'Invalid image id' }, { status: 400 });
        }
        try {
            const _id = new mongoose.Types.ObjectId(imageId);
            const bucket = getBucket();
            const [file] = await bucket.find({ _id }).toArray();
            if (!file) return NextResponse.json({ message: 'Image not found' }, { status: 404 });

            return new NextResponse(Readable.toWeb(bucket.openDownloadStream(_id)), {
                headers: {
                    'Content-Type': file.metadata?.contentType || 'image/jpeg',
                    'Content-Length': file.length.toString(),
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            });
        } catch (error) {
            console.error('Failed to stream image:', error);
            return NextResponse.json({ message: 'Failed to load image' }, { status: 500 });
        }
    }

    try {
        const destinations = await Destination.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ destinations });
    } catch (error) {
        console.error('Failed to load destinations:', error);
        return NextResponse.json({ message: 'Failed to load destinations' }, { status: 500 });
    }
}

// Create
export async function POST(request) {
    const uploadedIds = [];
    try {
        await connectDB();
        const parsed = parseForm(await request.formData());
        if (parsed.error) return NextResponse.json({ message: parsed.error }, { status: 400 });
        if (parsed.meta.some((m) => m.fileId)) {
            return NextResponse.json({ message: 'New destinations can only use new images' }, { status: 400 });
        }

        const images = await buildImages(parsed, uploadedIds);
        const destination = await Destination.create({
            name: parsed.name,
            desc: parsed.desc,
            images,
        });

        return NextResponse.json({ message: 'Destination added successfully', destination }, { status: 201 });
    } catch (error) {
        await Promise.all(uploadedIds.map(deleteFile));
        console.error('Failed to create destination:', error);
        return NextResponse.json({ message: 'Failed to create destination' }, { status: 500 });
    }
}

// Update: PUT /api/destinations?id=<destinationId>
export async function PUT(request) {
    const uploadedIds = [];
    try {
        await connectDB();
        const id = new URL(request.url).searchParams.get('id');
        if (!mongoose.isValidObjectId(id)) {
            return NextResponse.json({ message: 'Invalid destination id' }, { status: 400 });
        }

        const destination = await Destination.findById(id);
        if (!destination) return NextResponse.json({ message: 'Destination not found' }, { status: 404 });

        const parsed = parseForm(await request.formData());
        if (parsed.error) return NextResponse.json({ message: parsed.error }, { status: 400 });

        // Only allow keeping images that already belong to this destination
        const ownedIds = new Set(destination.images.map((i) => i.fileId));
        const keptIds = parsed.meta.filter((m) => m.fileId).map((m) => m.fileId);
        if (keptIds.some((fileId) => !ownedIds.has(fileId))) {
            return NextResponse.json({ message: 'Invalid image reference' }, { status: 400 });
        }

        const images = await buildImages(parsed, uploadedIds);
        const removed = destination.images.filter((i) => !keptIds.includes(i.fileId));

        destination.name = parsed.name;
        destination.desc = parsed.desc;
        destination.images = images;
        await destination.save();

        // Only delete old files after the DB save succeeded
        await Promise.all(removed.map((i) => deleteFile(i.fileId)));

        return NextResponse.json({ message: 'Destination updated successfully', destination });
    } catch (error) {
        await Promise.all(uploadedIds.map(deleteFile));
        console.error('Failed to update destination:', error);
        return NextResponse.json({ message: 'Failed to update destination' }, { status: 500 });
    }
}

// Delete: DELETE /api/destinations?id=<destinationId>
export async function DELETE(request) {
    try {
        await connectDB();
        const id = new URL(request.url).searchParams.get('id');
        if (!mongoose.isValidObjectId(id)) {
            return NextResponse.json({ message: 'Invalid destination id' }, { status: 400 });
        }

        const destination = await Destination.findByIdAndDelete(id);
        if (!destination) return NextResponse.json({ message: 'Destination not found' }, { status: 404 });

        await Promise.all(destination.images.map((i) => deleteFile(i.fileId)));

        return NextResponse.json({ message: 'Destination deleted' });
    } catch (error) {
        console.error('Failed to delete destination:', error);
        return NextResponse.json({ message: 'Failed to delete destination' }, { status: 500 });
    }
}