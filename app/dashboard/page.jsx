'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Gauge from './charts/Gauge';

export default function Dashboard() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    axios.get('/api/visits').then(({ data }) => setCount(data.count));
  }, []);


  return (
    <main className='flex flex-col gap-4'>
      <h1 className='bg-[#2D5F51] w-fit py-1 px-2 rounded-lg text-xl font-semibold text-white'>My Insights</h1>

      <div>
        {/* <Gauge  /> */}
      </div>

      {/* Insight Boxes */}
      <section className="grid md:grid-cols-4 grid-cols-1 gap-4">
        {/* Site Visits Count */}
        <button className='p-2 rounded-lg bg-gray-200 flex flex-col items-center gap-2 hover:bg-[#2D5F51] hover:text-white text-[#2D5F51] transition-all duration-300'>
          <p className='lg:text-[4.5rem] md:text-[3.5rem] text-[2.5rem] font-bold'>{count ?? '—'}</p>
          <span className='font-bold md:text-md text-sm bg-[#2D5F51] text-white p-1 px-2 rounded-[10px]'>Total Visitors</span>
        </button>

        {/* To be done later */}
        <button className='p-2 rounded-lg bg-gray-200 flex flex-col items-center gap-2 hover:bg-[#2D5F51] hover:text-white text-[#2D5F51] transition-all duration-300'>
          <p className='lg:text-[4.5rem] md:text-[3.5rem] text-[2.5rem] font-bold'>0</p>
          <span className='font-bold md:text-md text-sm bg-[#2D5F51] text-white p-1 px-2 rounded-[10px]'>Total Bookings</span>
        </button>
        <button className='p-2 rounded-lg bg-gray-200 flex flex-col items-center gap-2 hover:bg-[#2D5F51] hover:text-white text-[#2D5F51] transition-all duration-300'>
          <p className='lg:text-[4.5rem] md:text-[3.5rem] text-[2.5rem] font-bold'>0</p>
          <span className='font-bold md:text-md text-sm bg-[#2D5F51] text-white p-1 px-2 rounded-[10px]'>Revenue</span>
        </button>
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