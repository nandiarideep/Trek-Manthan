'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import logo from '@/assets/logo.jpeg';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-full flex items-center justify-center relative">
      {/* Background Watermark */}
      <Image
        src={logo}
        alt="Logo"
        fill
        className="object-contain opacity-10 z-0"
      />

      <div className="flex flex-col items-center justify-center text-center px-4 relative z-10">
        <h1 className="text-[5rem] font-bold text-[#1F5346] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8 font-semibold">OOPS! The page you're looking for doesn't exist.</p>
        <button
          onClick={() => router.back()}
          className="bg-[#1F5346] text-white px-4 cursor-pointer py-3 rounded-lg hover:bg-[#2D5F51] transition-colors duration-300 flex items-center gap-4 font-semibold"
        >
          <FaArrowAltCircleLeft className='text-xl' /> Go Back
        </button>
      </div>
    </div>
  );
}