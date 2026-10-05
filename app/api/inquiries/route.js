import { NextResponse } from 'next/server';
import { createInquiry } from '@/controllers/inquiry.controller';
import { connectDB } from '@/lib/db';
import Inquiry from '@/models/inquiry.model';

export async function POST(request) {
    try {
        const inquiry = await createInquiry(await request.json());
        return NextResponse.json(
            { message: 'Inquiry submitted successfully', inquiry },
            { status: 201 }
        );
    } catch (error) {
        if (error.status === 400) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        console.error('Failed to submit inquiry:', error);
        return NextResponse.json({ message: 'Failed to submit inquiry' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ inquiries });
    } catch (error) {
        console.error('Failed to fetch inquiries:', error);
        return NextResponse.json({ message: 'Failed to fetch inquiries' }, { status: 500 });
    }
}