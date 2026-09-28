'use client';

import { useState } from 'react';

const TRIP_TYPES = ['Family Trip', 'Solo Travel', 'Honeymoon', 'Group Tour'];
const BUDGETS = ['Under $1,500', '$1,500 – $5,000', '$5,000+'];

export default function ContactSection() {
    const [tripType, setTripType] = useState('Family Trip');
    const [budget, setBudget] = useState('$1,500 – $5,000');

    return (
        <main className="min-h-[100dvh] w-full px-4 py-6 sm:px-6 sm:py-8 bg-gradient-to-b from-[#F6EFDF] to-[#2d7a63] text-white flex flex-col items-center justify-center gap-6 sm:gap-10">
            <div className="relative w-full max-w-6xl mx-auto rounded-3xl border border-white/10 overflow-hidden bg-[#0e1310]">
                {/* Ambient glow, bottom-left */}
                <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/25 blur-[100px] rounded-full" />

                <div className="relative grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 p-5 sm:p-8 md:p-14">
                    {/* Left column */}
                    <div className="flex flex-col justify-between text-white">
                        <div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
                                Plan your next trip with us
                            </h2>

                            <ul className="mt-6 sm:mt-8 space-y-3 text-sm sm:text-base text-white/70">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 text-emerald-400">✓</span>
                                    We reply with a custom itinerary within 24 hours
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 text-emerald-400">✓</span>
                                    No booking fees, ever
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 text-emerald-400">✓</span>
                                    Local guides at every destination
                                </li>
                            </ul>
                        </div>

                        <div className="mt-10 md:mt-0">
                            <a href="mailto:hello@trekmanthan.com" className="text-white underline underline-offset-4">
                                hello@trekmanthan.com
                            </a>
                            <p className="mt-4 text-white/70">
                                Prefer to talk it through?
                            </p>
                            <button className="mt-4 px-5 py-2.5 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
                                Book a free call
                            </button>
                        </div>
                    </div>

                    {/* Right column — form */}
                    <form className="flex flex-col gap-5 sm:gap-6 text-white">
                        <div>
                            <p className="text-sm text-white/70 mb-2">Trip type</p>
                            <div className="flex flex-wrap gap-2">
                                {TRIP_TYPES.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setTripType(type)}
                                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${tripType === type
                                            ? 'bg-white text-black border-white'
                                            : 'border-white/20 text-white/70 hover:border-white/40'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-white/70 mb-2">Budget</p>
                            <div className="flex flex-wrap gap-2">
                                {BUDGETS.map((b) => (
                                    <button
                                        key={b}
                                        type="button"
                                        onClick={() => setBudget(b)}
                                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${budget === b
                                            ? 'bg-white text-black border-white'
                                            : 'border-white/20 text-white/70 hover:border-white/40'
                                            }`}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-white/70">Full name*</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-transparent border-b border-white/20 py-2 mt-1 focus:outline-none focus:border-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-white/70">Email*</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-transparent border-b border-white/20 py-2 mt-1 focus:outline-none focus:border-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-white/70">Where do you want to go?*</label>
                            <input
                                type="text"
                                required
                                placeholder="Destination, dates, number of travelers..."
                                className="w-full bg-transparent border-b border-white/20 py-2 mt-1 focus:outline-none focus:border-white placeholder:text-white/30"
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-2 w-full py-3.5 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors"
                        >
                            Send inquiry
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}