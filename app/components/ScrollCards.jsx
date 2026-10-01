'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SCROLL_CARDS_DATA as DEFAULT_CARDS } from '@/app/constants';
import MorphSlider from '@/components/MorphSlider';
import axios from 'axios';

export const SCROLL_CARD_DATA = DEFAULT_CARDS;

const FALLBACK_COLORS = [
    'bg-gradient-to-br from-yellow-300 via-orange-400 to-rose-500',
    'bg-gradient-to-br from-cyan-300 via-blue-400 to-indigo-600',
    'bg-gradient-to-br from-rose-300 via-pink-500 to-violet-600',
    'bg-gradient-to-br from-lime-300 via-emerald-500 to-teal-700',
];

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
                        items={card.image ? [{ image: card.image, caption: card.title || 'Destination' }] : [{ image: 'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=1600&auto=format&fit=crop', caption: card.title || 'Destination' }]}
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

export default function CascadeCards({ cards: propCards }) {
    const [cards, setCards] = useState(propCards || DEFAULT_CARDS);

    useEffect(() => {
        if (propCards) {
            setCards(propCards);
            return;
        }

        const loadCards = async () => {
            try {
                const { data } = await axios.get('/api/carousel-images');
                if (Array.isArray(data) && data.length > 0) {
                    const mapped = data.map((item, index) => ({
                        id: item.id ?? index + 1,
                        title: item.title || `Destination ${index + 1}`,
                        desc: item.desc || 'Explore our curated getaway.',
                        color: FALLBACK_COLORS[index % FALLBACK_COLORS.length],
                        image: item.image || '',
                    }));
                    setCards(mapped);
                    return;
                }
            } catch (error) {
                console.error('Failed to load destination cards:', error);
            }

            setCards(DEFAULT_CARDS);
        };

        loadCards();
    }, [propCards]);

    return (
        <section className="relative">
            {cards.map((card, i) => (
                <Card key={card.id ?? `${card.title}-${i}`} card={card} index={i} total={cards.length} />
            ))}
        </section>
    );
}