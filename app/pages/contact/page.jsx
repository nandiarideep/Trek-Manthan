'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import DateRangePicker from "../../components/DatePicker"
import toast, { Toaster } from 'react-hot-toast';

export default function Contact() {
    const [pageInfo, setPageInfo] = useState({ email: '', contact: '', address: '' });
    const [tripTypes, setTripTypes] = useState([]);
    const [budgets] = useState(['Under ₹ 5,000', '₹ 5,000 - ₹ 10,000', '₹ 10,000+']);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        destination: '',
        travelers: '',
        tripType: '',
        budget: '',
        startDate: '',
        endDate: '',
    });
    const [submitting, setSubmitting] = useState(false);

    // Custom handers
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            const response = await axios.post('/api/inquiries', formData);

            console.log('Inquiry created:', response.data);

            toast.success('Your inquiry has been submitted successfully!');

            // Reset form
            setFormData({
                fullName: '',
                email: '',
                destination: '',
                travelers: '',
                tripType: '',
                budget: '',
                startDate: '',
                endDate: '',
            });

        } catch (error) {
            console.error('Failed to submit inquiry:', error);

            toast.error(
                error.response?.data?.message ||
                'Something went wrong. Please try again.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const loadData = async () => {
            try {
                const [infoRes, tripTypeRes] = await Promise.allSettled([
                    axios.get('/api/info', { signal }),
                    axios.get('/api/tripTypes', { signal }),
                ]);

                if (infoRes.status === 'fulfilled') {
                    const settings = infoRes.value.data?.settings;
                    if (settings) {
                        setPageInfo({
                            address: settings.address || '',
                            email: settings.email || '',
                            contact: settings.contact || '',
                        });
                    }
                } else if (!axios.isCancel(infoRes.reason)) {
                    console.error('Failed to load info:', infoRes.reason);
                }

                if (tripTypeRes.status === 'fulfilled') {
                    const data = tripTypeRes.value.data;
                    if (Array.isArray(data)) {
                        setTripTypes(data.map((c) => c.name).filter(Boolean));
                    }
                } else if (!axios.isCancel(tripTypeRes.reason)) {
                    console.error('Failed to load trip types:', tripTypeRes.reason);
                }
            } finally {
                if (!signal.aborted) setLoading(false);
            }
        };

        loadData();

        return () => controller.abort();
    }, []);

    return (
        <main className="min-h-[100dvh] w-full px-4 py-6 sm:px-6 sm:py-8 bg-gradient-to-b from-[#F6EFDF] to-[#2d7a63] text-white flex flex-col items-center justify-center gap-6 sm:gap-10">
            <Toaster position="bottom-right" />

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
                            <a href={`mailto:${pageInfo.email}`} className="text-white underline underline-offset-4">
                                {pageInfo.email}
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
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6 text-white">
                        <div>
                            <p className="text-sm text-white/70 mb-2">Trip type</p>
                            <div className="flex flex-wrap gap-2">
                                {tripTypes.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                tripType: type,
                                            }))
                                        }
                                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${formData.tripType === type
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
                                {budgets.map((b) => (
                                    <button
                                        key={b}
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                budget: b,
                                            }))
                                        }
                                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${formData.budget === b
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
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent border-b border-white/20 py-2 mt-1 focus:outline-none focus:border-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-white/70">Email*</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent border-b border-white/20 py-2 mt-1 focus:outline-none focus:border-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-white/70">Destination?*</label>
                                <input
                                    type="text"
                                    name="destination"
                                    value={formData.destination}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent border-b border-white/20 py-2 mt-1 focus:outline-none focus:border-white placeholder:text-white/30"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-white/70">No of travelers?*</label>
                                <input
                                    type="number"
                                    name="travelers"
                                    value={formData.travelers}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                    className="w-full bg-transparent border-b border-white/20 py-2 mt-1 focus:outline-none focus:border-white placeholder:text-white/30"
                                />
                            </div>
                        </div>

                        <DateRangePicker
                            onChange={(range) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    startDate: range.from,
                                    endDate: range.to,
                                }));
                            }}
                        />

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-2 w-full py-3.5 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors cursor-pointer"
                        >
                            {submitting ? 'Sending...' : 'Send inquiry'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}