'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SCROLL_CARDS_DATA as CARDS, CAROUSEL_IMAGES as IMAGES } from '@/app/constants';
import MorphSlider from '@/components/MorphSlider';

const Card = ({ card, index, total }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
    const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.4]);

    return (
        <div
            ref={ref}
            className="sticky top-0 h-screen w-full flex items-center justify-center px-4 md:px-8"
        >
            <motion.div
                style={{
                    scale,
                    opacity,
                    top: `${index * 20}px`,
                }}
                className={`relative w-full min-w-0 lg:min-w-[1100px] xl:min-w-[1400px] h-[72vh] sm:h-[70vh] rounded-3xl ${card.color} shadow-2xl p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col text-black overflow-hidden`}
            >
                <div className="relative w-full min-w-0 flex-1 rounded-2xl overflow-hidden">
                    <MorphSlider
                        items={IMAGES}
                        transition="melt"
                        intensity={0.55}
                        aberration={0.35}
                        drift={0.4}
                        autoplay
                        overlayColor="#05060a"
                        duration={1.1}
                        ease="power2.inOut"
                        scale={2.4}
                        autoplayDelay={3}
                        loop
                        radius={16}
                        showCaptions={false}
                        showControls={false}
                        showIndicators
                    />
                </div>

                <div className="mt-4">
                    <span className="text-sm font-semibold opacity-70">
                        {String(index + 1).padStart(2, '0')} /{' '}
                        {String(total).padStart(2, '0')}
                    </span>

                    <h3 className="text-4xl font-bold mt-2 tracking-wide">
                        {card.title}
                    </h3>

                    <p className="text-lg mt-2 tracking-wide">
                        {card.desc}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default function CascadeCards() {
    return (
        <section className="relative">
            {CARDS.map((card, i) => (
                <Card key={card.id} card={card} index={i} total={CARDS.length} />
            ))}
        </section>
    );
}