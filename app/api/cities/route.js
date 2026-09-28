import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import City from '@/models/cities.model';

const starterCities = ['Delhi', 'Mumbai', 'Bangalore'];

export async function GET() {
  try {
    await connectDB();

    if (await City.countDocuments() === 0) {
      try {
        await City.insertMany(starterCities.map((name) => ({ name })), { ordered: false });
      } catch (error) {
        if (error.code !== 11000) throw error;
      }
    }

    const cities = await City.find({ active: true }).sort({ name: 1 }).select('name');
    return NextResponse.json(cities);
  } catch (error) {
    console.error('Failed to load cities:', error);
    return NextResponse.json({ message: 'Failed to load cities' }, { status: 500 });
  }
}