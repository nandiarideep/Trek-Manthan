'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import axios from 'axios';
import { SCROLL_CARDS_DATA as DEFAULT_CARDS } from '@/app/constants';
import MorphSlider from '@/components/MorphSlider';

export const SCROLL_CARD_DATA = DEFAULT_CARDS;

const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=1600&auto=format&fit=crop';
const CARD_COLORS = ['bg-gradient-to-br from-lime-300 via-emerald-500 to-teal-700'];

// Shape every card as { id, title, desc, color, images: [{ url, title }] }
const fromDestinations = (destinations) =>
    destinations
        .filter((dest) => dest.images?.length)
        .map((dest, i) => {
            return {
                id: dest._id,
                title: dest.title || dest.name,
                desc: dest.desc || 'Explore our curated getaway.',
                color: CARD_COLORS[i % CARD_COLORS.length],
                images: dest.images.map((img) => ({ url: img.url, title: dest.title || dest.name })),
            };
        });

const fromDefaults = (cards) =>
    cards.map((card, i) => ({
        id: card.id ?? i,
        title: card.title,
        desc: card.desc,
        color: card.color || CARD_COLORS[0],
        images: [{ url: card.image || FALLBACK_IMAGE, title: card.title }],
    }));

const Card = ({ card, index, total }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
    const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.4]);

    // Stable reference so MorphSlider doesn't re-initialise on parent re-renders
    const items = useMemo(
        () => card.images.map((img) => ({ image: img.url, caption: img.title || card.title })),
        [card.images, card.title]
    );
    const hasMultiple = items.length > 1;

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
                        items={items}
                        transition="melt"
                        intensity={0.55}
                        aberration={0.35}
                        drift={0.4}
                        autoplay={hasMultiple}
                        overlayColor="#05060a"
                        duration={1.1}
                        ease="power2.inOut"
                        scale={2.4}
                        autoplayDelay={3}
                        loop
                        radius={16}
                        showCaptions={false}
                        showControls={false}
                        showIndicators={hasMultiple}
                    />
                </div>
                <div className="flex justify-between">
                    <div className="mt-4">
                        <h3 className="text-4xl font-bold mt-2 tracking-wide">{card.title}</h3>

                        <p className="text-lg mt-2 tracking-wide">{card.desc}</p>
                    </div>
                    <button className="mt-4 px-6 py-2 bg-black/20 hover:bg-black/30 rounded-lg text-white font-semibold transition cursor-pointer">Book Now</button>
                </div>
            </motion.div>
        </div>
    );
};

export default function CascadeCards({ destinations }) {
    const [cards, setCards] = useState(destinations ? fromDestinations(destinations) : null);

    useEffect(() => {
        if (destinations) {
            setCards(fromDestinations(destinations));
            return;
        }

        const controller = new AbortController();

        const loadCards = async () => {
            try {
                const { data } = await axios.get('/api/destinations', {
                    signal: controller.signal,
                });
                const mapped = fromDestinations(data.destinations || []);
                setCards(mapped.length ? mapped : fromDefaults(DEFAULT_CARDS));
            } catch (error) {
                if (axios.isCancel(error)) return;
                console.error('Failed to load destinations:', error);
                setCards(fromDefaults(DEFAULT_CARDS));
            }
        };

        loadCards();
        return () => controller.abort();
    }, [destinations]);

    if (!cards) {
        return (
            <section className="h-screen w-full flex items-center justify-center px-4 md:px-8">
                <div className="w-full max-w-[1600px] h-[70vh] rounded-3xl bg-white/10 animate-pulse" />
            </section>
        );
    }

    return (
        <section className="relative">
            {cards.map((card, i) => (
                <Card key={card.id} card={card} index={i} total={cards.length} />
            ))}
        </section>
    );
}