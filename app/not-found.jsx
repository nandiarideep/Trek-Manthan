'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import logo from '@/assets/logo.jpeg';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6EFDF] relative font-anton">
      {/* Background Watermark */}
      <Image
        src={logo}
        alt="Logo"
        fill
        className="object-contain opacity-10 z-0"
      />

      <div className="flex flex-col items-center justify-center text-center px-4 relative z-10">
        <h1 className="text-[6rem] font-bold text-[#1F5346] mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8 font-semibold text-lg tracking-wide">OOPS! The page you're looking for is <span className="text-[#1F5346] font-bold">COMING SOON !</span></p>
        <button
          onClick={() => router.back()}
          className="bg-[#1F5346] text-white px-4 cursor-pointer py-3 rounded-lg hover:bg-[#2D5F51] transition-colors duration-300 flex items-center gap-4 tracking-widest font-medium"
        >
          <FaArrowAltCircleLeft className='text-xl' /> Go Back
        </button>
      </div>
    </div>
  );
}