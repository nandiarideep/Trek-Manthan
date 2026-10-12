'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInquiries } from '@/lib/features/inquiries/inquiriesSlice';
import { fetchVisits } from '@/lib/features/visits/visitsSlice';
import { fetchBookings } from '@/lib/features/bookings/bookingsSlice';

export default function Dashboard() {
  const dispatch = useDispatch();

  const inquiryCount = useSelector((state) => state.inquiries.items.length);
  const visitorCount = useSelector((state) => state.visits.count);
  const bookingCount = useSelector((state) => state.bookings.items.length);

  useEffect(() => {
    dispatch(fetchInquiries())
    dispatch(fetchVisits())
    dispatch(fetchBookings())
  }, [dispatch]);

  return (
    <main className='flex flex-col gap-4'>
      <h1 className='bg-[#2D5F51] w-fit py-1 px-2 rounded-lg text-xl font-semibold text-white'>My Insights</h1>

      {/* Insight Boxes */}
      <section className="grid md:grid-cols-4 grid-cols-1 gap-4">
        {/* Site Visits Count */}
        <button className='p-2 rounded-lg bg-gray-200 flex flex-col items-center gap-2 hover:bg-[#2D5F51] hover:text-white text-[#2D5F51] transition-all duration-300'>
          <p className='lg:text-[4.5rem] md:text-[3.5rem] text-[2.5rem] font-bold'>{visitorCount ?? '—'}</p>
          <span className='font-bold md:text-md text-sm bg-[#2D5F51] text-white p-1 px-2 rounded-[10px]'>Total Visitors</span>
        </button>

        {/* Total Inquiries */}
        <button className='p-2 rounded-lg bg-gray-200 flex flex-col items-center gap-2 hover:bg-[#2D5F51] hover:text-white text-[#2D5F51] transition-all duration-300'>
          <p className='lg:text-[4.5rem] md:text-[3.5rem] text-[2.5rem] font-bold'>{inquiryCount ?? '—'}</p>
          <span className='font-bold md:text-md text-sm bg-[#2D5F51] text-white p-1 px-2 rounded-[10px]'>Total Inquiries</span>
        </button>

        {/* Total Bookings */}
        <button className='p-2 rounded-lg bg-gray-200 flex flex-col items-center gap-2 hover:bg-[#2D5F51] hover:text-white text-[#2D5F51] transition-all duration-300'>
          <p className='lg:text-[4.5rem] md:text-[3.5rem] text-[2.5rem] font-bold'>{bookingCount ?? '—'}</p>
          <span className='font-bold md:text-md text-sm bg-[#2D5F51] text-white p-1 px-2 rounded-[10px]'>Total Bookings</span>
        </button>

        {/* Total Revenue */}
        <button className='p-2 rounded-lg bg-gray-200 flex flex-col items-center gap-2 hover:bg-[#2D5F51] hover:text-white text-[#2D5F51] transition-all duration-300'>
          <p className='lg:text-[4.5rem] md:text-[3.5rem] text-[2.5rem] font-bold'>0</p>
          <span className='font-bold md:text-md text-sm bg-[#2D5F51] text-white p-1 px-2 rounded-[10px]'>Revenue</span>
        </button>

        {/* Conversion Rate */}
        <button className='p-2 rounded-lg bg-gray-200 flex flex-col items-center gap-2 hover:bg-[#2D5F51] hover:text-white text-[#2D5F51] transition-all duration-300'>
          <p className='lg:text-[4.5rem] md:text-[3.5rem] text-[2.5rem] font-bold'>0%</p>
          <span className='font-bold md:text-md text-sm bg-[#2D5F51] text-white p-1 px-2 rounded-[10px]'>Conversion Rate</span>
        </button>
      </section>

      <section>

      </section>
    </main>
  );
}