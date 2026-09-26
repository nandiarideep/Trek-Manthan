import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ email: 'dummyemail.com' });
}

export async function POST() {
  return NextResponse.json({ message: 'Header updated successfully' });
}