'use client';
import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { RiResetRightFill } from 'react-icons/ri';
import { FaTimes } from 'react-icons/fa';

const MAX_IMAGES = 5;

const Page = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        images: [],
    });

    const [loading, setLoading] = useState(false);

    const handleImageFiles = (fileList) => {
        const incomingFiles = Array.from(fileList || []).filter((file) => file.type.startsWith('image/'));

        if (!incomingFiles.length) {
            toast.error('Please select image files only.');
            return;
        }

        setFormData((prev) => {
            const remainingSlots = MAX_IMAGES - prev.images.length;
            if (remainingSlots <= 0) {
                toast.error(`You can upload up to ${MAX_IMAGES} images only.`);
                return prev;
            }

            const allowed = incomingFiles.slice(0, remainingSlots);
            if (allowed.length !== incomingFiles.length) {
                toast.error(`You can upload up to ${MAX_IMAGES} images only.`);
            }

            const newImages = allowed.map((file, index) => ({
                id: prev.images.length + index + 1,
                file,
                title: '',
                desc: '',
            }));

            return {
                ...prev,
                images: [...prev.images, ...newImages],
            };
        });

        if (incomingFiles.length > 0) {
            toast.success('Images added successfully');
        }
    };

    const updateImageMeta = (index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: value } : item
            ),
        }));
    };

    const handleRemoveImage = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images
                .filter((_, index) => index !== indexToRemove)
                .map((item, index) => ({ ...item, id: index + 1 })),
        }));
    };

    const handleReset = () => {
        setFormData({ images: [] });
        const input = document.getElementById('destinationImages');
        if (input) input.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (formData.images.length === 0) {
                toast.error('Please upload at least one image.');
                return;
            }

            if (formData.images.length > MAX_IMAGES) {
                toast.error(`You can upload up to ${MAX_IMAGES} images only.`);
                return;
            }

            const payload = new FormData();
            formData.images.forEach((item) => {
                payload.append('destinationImages', item.file);
            });
            payload.append('destinationImageMeta', JSON.stringify(
                formData.images.map(({ id, title, desc }) => ({ id, title, desc }))
            ));

            const { data } = await axios.post('/api/carousel-images', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success(data?.message || 'Destination images updated successfully!');
            handleReset();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className='flex flex-col gap-4'>
            <Toaster position="bottom-right" />

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <h1 className='bg-[#2D5F51] w-fit py-1 px-2 rounded-lg text-xl font-semibold text-white'>
                    Update Destination Information
                </h1>

                <div className='bg-gray-100 rounded-lg grid grid-cols-1 gap-8 p-4'>
                    <div className='flex flex-col gap-3 relative'>
                        <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-6 left-0 rounded-t-lg'>
                            Upload Images
                        </label>

                        <label
                            htmlFor="destinationImages"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                handleImageFiles(e.dataTransfer.files);
                            }}
                            className='flex flex-col items-center justify-center gap-2 px-3 py-6 rounded-b-lg rounded-tr-lg border-2 border-dashed border-gray-300 hover:border-[#2D5F51] cursor-pointer transition-all duration-300 text-center'
                        >
                            <span className='font-semibold text-gray-600'>
                                Choose up to {5} images or drag and drop here
                            </span>
                            <span className='text-sm text-gray-400'>
                                JPG, PNG, WEBP — up to 5 images total
                            </span>
                            <input
                                type="file"
                                id="destinationImages"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleImageFiles(e.target.files)}
                                className='hidden'
                            />
                        </label>

                        {formData.images.length > 0 && (
                            <div className='grid grid-cols-1 gap-4'>
                                {formData.images.map((item, index) => (
                                    <div key={`${item.file.name}-${item.id}`} className='rounded-lg border border-gray-300 bg-white p-3'>
                                        <div className='flex flex-col gap-3 md:flex-row'>
                                            <div className='relative w-full md:w-44'>
                                                <img
                                                    src={URL.createObjectURL(item.file)}
                                                    alt={`Destination ${index + 1}`}
                                                    className='h-28 w-full rounded-md object-cover'
                                                />
                                                <button
                                                    type='button'
                                                    onClick={() => handleRemoveImage(index)}
                                                    className='absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 cursor-pointer'
                                                    aria-label={`Remove image ${index + 1}`}
                                                >
                                                    <FaTimes size={12} />
                                                </button>
                                            </div>

                                            <div className='flex flex-1 flex-col gap-3'>
                                                <div className='flex flex-col gap-1'>
                                                    <label className='text-sm font-semibold text-gray-700'>ID</label>
                                                    <input
                                                        type='number'
                                                        value={item.id}
                                                        onChange={(e) => updateImageMeta(index, 'id', Number(e.target.value) || 1)}
                                                        className='rounded border border-gray-300 px-3 py-2 text-sm focus:outline-[#2D5F51]'
                                                    />
                                                </div>

                                                <div className='flex flex-col gap-1'>
                                                    <label className='text-sm font-semibold text-gray-700'>Title</label>
                                                    <input
                                                        type='text'
                                                        value={item.title}
                                                        onChange={(e) => updateImageMeta(index, 'title', e.target.value)}
                                                        placeholder='Card title'
                                                        className='rounded border border-gray-300 px-3 py-2 text-sm focus:outline-[#2D5F51]'
                                                    />
                                                </div>

                                                <div className='flex flex-col gap-1'>
                                                    <label className='text-sm font-semibold text-gray-700'>Description</label>
                                                    <textarea
                                                        value={item.desc}
                                                        onChange={(e) => updateImageMeta(index, 'desc', e.target.value)}
                                                        placeholder='Card description'
                                                        rows={3}
                                                        className='rounded border border-gray-300 px-3 py-2 text-sm focus:outline-[#2D5F51]'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className='text-sm text-gray-600'>
                            {formData.images.length}/{MAX_IMAGES} images selected
                        </p>
                    </div>
                </div>

                <section className='flex gap-4 mt-2 font-semibold'>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-[#1F5346] text-white px-4 py-2 rounded-lg hover:bg-[#2D5F51] flex items-center gap-2 cursor-pointer duration-200"
                    >
                        <FaArrowAltCircleLeft /> Go Back
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        className="bg-[#1F5346] text-white px-4 py-2 rounded-lg hover:bg-[#2D5F51] flex items-center gap-2 cursor-pointer duration-200"
                    >
                        <RiResetRightFill /> Reset
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className='text-white px-4 py-2 rounded-lg bg-[#2D5F51] hover:bg-[#1F5346]/80 disabled:opacity-50 cursor-pointer duration-200'
                    >
                        {loading ? 'Updating...' : 'Update Changes'}
                    </button>
                </section>
            </form>
        </main>
    );
};

export default Page;