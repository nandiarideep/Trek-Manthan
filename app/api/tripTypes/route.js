import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import TripType from '@/models/tripTypes.model';

// Get Api
export async function GET() {
    try {
        await connectDB();

        const tripTypes = await TripType.find({ active: true }).sort({ name: 1 }).select('name');
        return NextResponse.json(tripTypes);
    } catch (error) {
        console.error('Failed to load trip types:', error);
        return NextResponse.json({ message: 'Failed to load trip types' }, { status: 500 });
    }
}

// Post Api
export async function POST(request) {
    try {
        await connectDB();
        const { name } = await request.json();
        const normalizedName = typeof name === 'string' ? name.trim() : '';

        if (!normalizedName) {
            return NextResponse.json({ message: 'Trip type is required' }, { status: 400 });
        }

        const existingTripType = await TripType.findOne({ name: { $regex: `^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
        if (existingTripType) {
            return NextResponse.json({ message: 'Trip type already exists' }, { status: 409 });
        }

        const tripType = await TripType.create({ name: normalizedName });
        return NextResponse.json(tripType, { status: 201 });
    } catch (error) {
        console.error('Failed to create tripType:', error);
        return NextResponse.json({ message: 'Failed to create trip types' }, { status: 500 });
    }
}

// Delete Api
export async function DELETE(request) {
    try {
        const id = new URL(request.url).searchParams.get('id');
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid trip type ID' }, { status: 400 });
        }

        await connectDB();
        const tripType = await TripType.findByIdAndDelete(id);
        if (!tripType) {
            return NextResponse.json({ message: 'Trip type not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Trip type deleted successfully' });
    } catch (error) {
        console.error('Failed to delete trip type:', error);
        return NextResponse.json({ message: 'Failed to delete trip type' }, { status: 500 });
    }
}