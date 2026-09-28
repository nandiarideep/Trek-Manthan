'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import RotatingText from "@/components/RotatingText";

const Page = () => {
    const [pageInfo, setPageInfo] = useState({ tagline: '', secondTagline: '' });
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const loadData = async () => {
            try {
                const [infoRes, citiesRes] = await Promise.allSettled([
                    axios.get('/api/info', { signal }),
                    axios.get('/api/cities', { signal }),
                ]);

                if (infoRes.status === 'fulfilled') {
                    const settings = infoRes.value.data?.settings;
                    if (settings) {
                        setPageInfo({
                            tagline: settings.tagline || '',
                            secondTagline: settings.secondTagline || '',
                        });
                    }
                } else if (!axios.isCancel(infoRes.reason)) {
                    console.error('Failed to load info:', infoRes.reason);
                }

                if (citiesRes.status === 'fulfilled') {
                    const data = citiesRes.value.data;
                    if (Array.isArray(data)) {
                        setCities(data.map((c) => c.name).filter(Boolean));
                    }
                } else if (!axios.isCancel(citiesRes.reason)) {
                    console.error('Failed to load cities:', citiesRes.reason);
                }
            } finally {
                if (!signal.aborted) setLoading(false);
            }
        };

        loadData();

        return () => controller.abort();
    }, []);

    return (
        <main className="antialiased w-full">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                poster="/images/fallback.jpg"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
            >
                <source src="/videos/bg.webm" type="video/webm" />
                <source src="/videos/bg.MOV" type="video/mp4" />
            </video>
            {/* Overlay */}
            <span className="absolute inset-0 bg-black/50 z-10"></span>
            {/* Content */}
            <section className="relative z-20 flex flex-col items-center justify-center h-screen text-center text-white px-4 font-anton">
                <h1 className='text-3xl sm:text-4xl md:text-6xl lg:text-[5rem] leading-tight'>
                    {pageInfo.tagline}
                </h1>
                {cities.length > 0 && (
                    <h2 className='text-3xl sm:text-4xl md:text-6xl lg:text-[5rem] leading-tight flex flex-wrap items-center justify-center gap-x-3 gap-y-2 w-[100%]'>
                        <span>Across</span>
                        <RotatingText
                            texts={cities}
                            mainClassName="inline-flex px-2 sm:px-2 md:px-3 bg-green-600 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                            staggerFrom="last"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "-120%" }}
                            staggerDuration={0.050}
                            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                            transition={{ type: "spring", damping: 30, stiffness: 200 }}
                            rotationInterval={2000}
                            splitBy="characters"
                            auto
                            loop
                        />
                    </h2>
                )}
                <p className='text-sm sm:text-base md:text-lg lg:text-xl mt-4 max-w-xs sm:max-w-md md:max-w-2xl'>
                    {pageInfo.secondTagline}
                </p>
            </section>
        </main>
    )
}

export default Page;