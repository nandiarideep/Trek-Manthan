import { NextResponse } from 'next/server';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { connectDB } from '@/lib/db';
import Info from '@/models/info.model';
import mongoose from 'mongoose';

function getBucket() {
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'videos' });
}

let gridFSIndexPromise;

function ensureGridFSIndexes() {
  if (!gridFSIndexPromise) {
    const chunks = mongoose.connection.db.collection('videos.chunks');
    gridFSIndexPromise = chunks
      .createIndex({ files_id: 1, n: 1 }, { unique: true })
      .catch((error) => {
        gridFSIndexPromise = null;
        throw error;
      });
  }

  return gridFSIndexPromise;
}

export async function GET(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('video');

  // --- Stream video ---
  if (videoId) {
    try {
      await ensureGridFSIndexes();
      const _id = new mongoose.Types.ObjectId(videoId);
      const bucket = getBucket();

      const files = await bucket.find({ _id }).toArray();
      if (!files.length) {
        return NextResponse.json({ message: 'Video not found' }, { status: 404 });
      }

      const file = files[0];
      const headers = new Headers({
        'Accept-Ranges': 'bytes',
        'Content-Type': file.metadata?.contentType || 'video/mp4',
        'Cache-Control': 'public, max-age=31536000, immutable',
      });
      const range = request.headers.get('range');
      let start = 0;
      let end = file.length - 1;
      let status = 200;

      if (range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range);
        if (!match || (!match[1] && !match[2])) {
          return new Response(null, {
            status: 416,
            headers: { 'Content-Range': `bytes */${file.length}` },
          });
        }

        if (!match[1]) {
          const suffixLength = Number(match[2]);
          if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) {
            return new Response(null, {
              status: 416,
              headers: { 'Content-Range': `bytes */${file.length}` },
            });
          }
          start = Math.max(file.length - suffixLength, 0);
        } else {
          start = Number(match[1]);
          if (match[2]) end = Math.min(Number(match[2]), end);
        }

        if (start > end || start >= file.length) {
          return new Response(null, {
            status: 416,
            headers: { 'Content-Range': `bytes */${file.length}` },
          });
        }

        status = 206;
        headers.set('Content-Range', `bytes ${start}-${end}/${file.length}`);
      }

      headers.set('Content-Length', String(end - start + 1));
      const downloadStream = bucket.openDownloadStream(_id, { start, end: end + 1 });
      return new Response(Readable.toWeb(downloadStream), { status, headers });
    } catch (error) {
      console.error('Failed to stream video:', error);
      return NextResponse.json({ message: 'Invalid video id' }, { status: 400 });
    }
  }

  try {
    const settings = await Info.findOne().lean();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Failed to load site settings:', error);
    return NextResponse.json({ message: 'Failed to load site settings' }, { status: 500 });
  }
}

export async function POST(request) {
  let uploadedFileId;

  try {
    await connectDB();
    const body = await request.formData();
    const existingSettings = await Info.findOne().lean();
    const video = body.get('videoFile');
    let videoFile = existingSettings?.videoFile || null;

    if (video && typeof video !== 'string' && typeof video.stream === 'function' && video.size > 0) {
      if (video.size > 100 * 1024 * 1024) {
        return NextResponse.json({ message: 'Video must be under 100MB' }, { status: 413 });
      }

      const bucket = getBucket();
  await ensureGridFSIndexes();
      const uploadStream = bucket.openUploadStream(video.name, {
        metadata: { contentType: video.type || 'application/octet-stream' },
      });
      await pipeline(Readable.fromWeb(video.stream()), uploadStream);
      uploadedFileId = uploadStream.id;
      videoFile = `/api/info?video=${uploadedFileId.toString()}`;

      // Clean up the old video from GridFS, if one existed
      if (existingSettings?.videoFile) {
        const oldId = existingSettings.videoFile.split('video=')[1];
        if (oldId) {
          await bucket.delete(new mongoose.Types.ObjectId(oldId)).catch(() => { });
        }
      }
    }

    let cityNames = [];
    try {
      const parsedCityNames = JSON.parse(body.get('cityNames') || '[]');
      if (Array.isArray(parsedCityNames)) cityNames = parsedCityNames;
    } catch {
      return NextResponse.json({ message: 'Invalid city names' }, { status: 400 });
    }

    const getText = (key) => {
      const value = body.get(key);
      return typeof value === 'string' ? value : '';
    };

    const settings = {
      ...(videoFile ? { videoFile } : {}),
      cityNames: [...new Set(cityNames.filter((name) => typeof name === 'string'))],
      email: getText('email'),
      contact: getText('contact'),
      address: getText('address'),
      facebook: getText('facebook'),
      whatsapp: getText('whatsapp'),
      instagram: getText('instagram'),
      tagline: getText('tagline'),
      secondTagline: getText('secondTagline'),
    };

    const savedSettings = await Info.findOneAndUpdate(
      {},
      { $set: settings, $unset: { videoLink: '' } },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    return NextResponse.json({ message: 'Info updated successfully', settings: savedSettings });
  } catch (error) {
    if (uploadedFileId && mongoose.connection.db) {
      await getBucket().delete(uploadedFileId).catch(() => { });
    }
    console.error('Failed to update site info:', error);
    return NextResponse.json({ message: 'Failed to update site info' }, { status: 500 });
  }
}