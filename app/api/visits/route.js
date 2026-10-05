import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Visit from '@/models/visit.model';

export async function POST() {
    await connectDB();
    const updated = await Visit.findOneAndUpdate(
        {},
        { $inc: { count: 1 } },
        { new: true, upsert: true }
    ).lean();

    return NextResponse.json({ count: updated.count });
}

export async function GET() {
    await connectDB();
    const visit = await Visit.findOne().lean();
    return NextResponse.json({ count: visit?.count || 0 });
}