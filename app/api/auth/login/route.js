import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  const { username, password } = await request.json();

  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ id: 'mock-user' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return NextResponse.json({ token });
  }

  return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}