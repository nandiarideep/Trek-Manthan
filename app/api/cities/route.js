import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import City from '@/models/cities.model';

// Get Api
export async function GET() {
    try {
        await connectDB();

        const cities = await City.find({ active: true }).sort({ name: 1 }).select('name');
        return NextResponse.json(cities);
    } catch (error) {
        console.error('Failed to load cities:', error);
        return NextResponse.json({ message: 'Failed to load cities' }, { status: 500 });
    }
}

// Post Api
export async function POST(request) {
    try {
        await connectDB();
        const { name } = await request.json();
        const normalizedName = typeof name === 'string' ? name.trim() : '';

        if (!normalizedName) {
            return NextResponse.json({ message: 'City name is required' }, { status: 400 });
        }

        const existingCity = await City.findOne({ name: { $regex: `^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
        if (existingCity) {
            return NextResponse.json({ message: 'City already exists' }, { status: 409 });
        }

        const city = await City.create({ name: normalizedName });
        return NextResponse.json(city, { status: 201 });
    } catch (error) {
        console.error('Failed to create city:', error);
        return NextResponse.json({ message: 'Failed to create city' }, { status: 500 });
    }
}

// Delete Api
export async function DELETE(request) {
    try {
        const id = new URL(request.url).searchParams.get('id');
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid city ID' }, { status: 400 });
        }

        await connectDB();
        const city = await City.findByIdAndDelete(id);
        if (!city) {
            return NextResponse.json({ message: 'City not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'City deleted successfully' });
    } catch (error) {
        console.error('Failed to delete city:', error);
        return NextResponse.json({ message: 'Failed to delete city' }, { status: 500 });
    }
}