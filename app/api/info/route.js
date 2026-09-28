import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Info from '@/models/info.model';

export async function GET() {
  try {
    await connectDB();
    const settings = await Info.findOne().lean();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Failed to load site settings:', error);
    return NextResponse.json({ message: 'Failed to load site settings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const settings = {
      videoLink: body.videoLink || '',
      cityNames: Array.isArray(body.cityNames) ? [...new Set(body.cityNames.filter((name) => typeof name === 'string'))] : [],
      email: body.email || '',
      contact: body.contact || '',
      address: body.address || '',
      facebook: body.facebook || '',
      whatsapp: body.whatsapp || '',
      instagram: body.instagram || '',
      tagline: body.tagline || '',
      secondTagline: body.secondTagline || '',
    };
    const savedSettings = await Info.findOneAndUpdate(
      {},
      { $set: settings },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    return NextResponse.json({ message: 'Info updated successfully', settings: savedSettings });
  } catch (error) {
    console.error('Failed to update site info:', error);
    return NextResponse.json({ message: 'Failed to update site info' }, { status: 500 });
  }
}