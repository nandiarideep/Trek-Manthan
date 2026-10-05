import { connectDB } from '@/lib/db';
import Inquiry from '@/models/inquiry.model';

function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}

export async function createInquiry(payload) {
  const fullName = typeof payload?.fullName === 'string' ? payload.fullName.trim() : '';
  const email = typeof payload?.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const destination = typeof payload?.destination === 'string' ? payload.destination.trim() : '';
  const travelers = Number(payload?.travelers);
  const tripType = typeof payload?.tripType === 'string' ? payload.tripType.trim() : '';
  const budget = typeof payload?.budget === 'string' ? payload.budget.trim() : '';

  if (!fullName || !email || !destination || !payload?.travelers) {
    throw badRequest('Name, email, destination, and traveler count are required');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw badRequest('Please provide a valid email address');
  }
  if (!Number.isInteger(travelers) || travelers < 1) {
    throw badRequest('Traveler count must be a positive whole number');
  }

  const startDate = payload.startDate ? new Date(payload.startDate) : undefined;
  const endDate = payload.endDate ? new Date(payload.endDate) : undefined;
  if ((startDate && Number.isNaN(startDate.getTime())) || (endDate && Number.isNaN(endDate.getTime()))) {
    throw badRequest('Please provide valid travel dates');
  }
  if (startDate && endDate && startDate > endDate) {
    throw badRequest('End date must be on or after the start date');
  }

  await connectDB();
  return Inquiry.create({
    fullName,
    email,
    destination,
    travelers,
    tripType,
    budget,
    startDate,
    endDate,
  });
}