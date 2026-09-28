'use client';

import Lottie from 'lottie-react';
import { useRouter } from 'next/navigation';
import header from '@/assets/gifs/content-moderation.json';
import carousel from '@/assets/gifs/carousel.json';
import destinations from '@/assets/gifs/destination-cards.json';

const page = () => {
    const router = useRouter();

    return (
        <main className='grid md:grid-cols-3 grid-cols-2 gap-4'>
            <button onClick={() => router.push('/dashboard/landingPage')} className='p-2 rounded-lg bg-gray-200 flex flex-col items-center gap-2 hover:bg-[#2D5F51] hover:text-white text-[#2D5F51] transition-all duration-300 cursor-pointer'>
                <Lottie animationData={header} loop={true} style={{ filter: 'hue-rotate(110deg)', width: '200px', height: '200px' }} />
                <span className='font-bold md:text-md text-sm bg-[#2D5F51] text-white p-1 px-2 rounded-[10px]'>Update Website Landing Page Info</span>
            </button>

            <button onClick={() => router.push('/dashboard/carousel')} className='p-2 rounded-lg bg-gray-200 flex flex-col items-center gap-2 hover:bg-[#2D5F51] hover:text-white text-[#2D5F51] transition-all duration-300 cursor-pointer'>
                <Lottie animationData={carousel} loop={true} style={{ filter: 'hue-rotate(110deg)', width: '200px', height: '200px' }} />
                <span className='font-bold md:text-md text-sm bg-[#2D5F51] text-white p-1 px-2 rounded-[10px]'>Update Carousel Data</span>
            </button>

            <button onClick={() => router.push('/dashboard/destinations')} className='p-2 rounded-lg bg-gray-200 flex flex-col items-center gap-2 hover:bg-[#2D5F51] hover:text-white text-[#2D5F51] transition-all duration-300 cursor-pointer'>
                <Lottie animationData={destinations} loop={true} style={{ filter: 'hue-rotate(110deg)', width: '200px', height: '200px' }} />
                <span className='font-bold md:text-md text-sm bg-[#2D5F51] text-white p-1 px-2 rounded-[10px]'>Update Destination Cards Data</span>
            </button>

        </main>
    )
}

export default page