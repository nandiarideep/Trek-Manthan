'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaArrowAltCircleLeft, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { RiResetRightFill } from 'react-icons/ri';
import { fetchDestinations } from '@/lib/features/destinations/destinationsSlice';

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const emptyForm = { name: '', title: '', desc: '', images: [] };

const Page = () => {
    const dispatch = useDispatch()
    const { items: destinations, status, error } = useSelector((state) => state.destinations)
    const router = useRouter();
    const keyRef = useRef(0);
    const nextKey = () => `img-${++keyRef.current}`;

    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchDestinations())
        }
    }, [dispatch, status]);

    // Blob previews must be revoked to free memory
    const revokePreviews = (images) =>
        images.forEach((img) => img.preview && URL.revokeObjectURL(img.preview));

    const resetForm = () => {
        revokePreviews(form.images);
        setForm(emptyForm);
        setEditingId(null);
        const input = document.getElementById('destinationImages');
        if (input) input.value = '';
    };

    const handleImageFiles = (fileList) => {
        const incoming = Array.from(fileList || []);
        const valid = incoming.filter((f) => f.type.startsWith('image/') && f.size <= MAX_IMAGE_SIZE);

        if (valid.length !== incoming.length) toast.error('Only image files under 10MB are allowed.');
        if (!valid.length) return;

        const slots = MAX_IMAGES - form.images.length;
        if (slots <= 0) {
            toast.error(`You can upload up to ${MAX_IMAGES} images only.`);
            return;
        }

        const allowed = valid.slice(0, slots);
        if (allowed.length < valid.length) toast.error(`You can upload up to ${MAX_IMAGES} images only.`);

        setForm((prev) => ({
            ...prev,
            images: [
                ...prev.images,
                ...allowed.map((file) => ({
                    key: nextKey(),
                    file,
                    preview: URL.createObjectURL(file),
                    fileId: null,
                    url: null,
                })),
            ],
        }));
    };

    const handleRemoveImage = (index) => {
        revokePreviews([form.images[index]]);
        setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const startEdit = (dest) => {
        revokePreviews(form.images);
        setEditingId(dest._id);
        setForm({
            name: dest.name,
            title: dest.title || dest.images.find((img) => img.title)?.title || '',
            desc: dest.desc || dest.images.find((img) => img.desc)?.desc || '',
            images: dest.images.map((img) => ({
                key: nextKey(),
                file: null,
                preview: null,
                fileId: img.fileId,
                url: img.url,
            })),
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) return toast.error('Please enter a destination name.');
        if (!form.title.trim()) return toast.error('Please enter a destination title.');
        if (!form.desc.trim()) return toast.error('Please enter a destination description.');
        if (form.images.length === 0) return toast.error('Please add at least one image.');

        setLoading(true);
        try {
            const payload = new FormData();
            payload.append('name', form.name.trim());
            payload.append('title', form.title.trim());
            payload.append('desc', form.desc.trim());

            // Order matters: entries with fileId null consume newImages in order
            payload.append(
                'images',
                JSON.stringify(form.images.map(({ fileId }) => ({ fileId })))
            );
            form.images.forEach((item) => {
                if (item.file) payload.append('newImages', item.file);
            });

            const { data } = editingId
                ? await axios.put(`/api/destinations?id=${editingId}`, payload)
                : await axios.post('/api/destinations', payload);

            toast.success(data.message);
            resetForm();
            await dispatch(fetchDestinations()).unwrap();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async (dest) => {
        try {
            await axios.delete('/api/destinations', { params: { id: dest._id } });
            if (editingId === dest._id) resetForm();
            await dispatch(fetchDestinations()).unwrap();
            toast.success('Destination deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete destination');
        }
    };

    const handleDelete = (dest) => {
        toast(
            (t) => (
                <div className='flex flex-col gap-2'>
                    <span>
                        Delete <strong>{dest.name}</strong> and all its images?
                    </span>
                    <div className='flex justify-end gap-2'>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className='cursor-pointer rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                confirmDelete(dest);
                            }}
                            className='cursor-pointer rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700'
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ),
            { duration: Infinity }
        );
    };

    return (
        <main className='flex flex-col gap-4'>
            <Toaster position='bottom-right' />

            {/* Form */}
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <h1 className='w-fit rounded-lg bg-[#2D5F51] px-2 py-1 text-xl font-semibold text-white'>
                    {editingId ? 'Edit Destination' : 'Add New Destination'}
                </h1>

                <div className='grid grid-cols-1 gap-8 rounded-lg bg-gray-100 p-4'>
                    {/* Name */}
                    <div className='relative flex flex-col gap-1'>
                        <label className='absolute -top-6 left-0 rounded-t-lg bg-[#2D5F51] px-2 font-semibold text-white'>
                            Destination Name
                        </label>
                        <input
                            type='text'
                            value={form.name}
                            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder='e.g. Manali'
                            className='rounded-b-lg rounded-tr-lg border border-gray-300 px-3 py-2 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51]'
                        />
                    </div>

                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div className='flex flex-col gap-1'>
                            <label className='font-semibold text-gray-700'>Destination Title</label>
                            <input
                                type='text'
                                value={form.title}
                                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                                placeholder='e.g. Himalayan Escape'
                                className='rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D5F51]'
                            />
                        </div>
                        <div className='flex flex-col gap-1 md:col-span-2'>
                            <label className='font-semibold text-gray-700'>Destination Description</label>
                            <textarea
                                value={form.desc}
                                onChange={(e) => setForm((prev) => ({ ...prev, desc: e.target.value }))}
                                placeholder='Describe this destination'
                                rows={3}
                                className='rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D5F51]'
                            />
                        </div>
                    </div>

                    {/* Images */}
                    <div className='relative flex flex-col gap-3'>
                        <label className='absolute -top-6 left-0 rounded-t-lg bg-[#2D5F51] px-2 font-semibold text-white'>
                            Carousel Images
                        </label>

                        {form.images.length < MAX_IMAGES && (
                            <label
                                htmlFor='destinationImages'
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    handleImageFiles(e.dataTransfer.files);
                                }}
                                className='flex cursor-pointer flex-col items-center justify-center gap-2 rounded-b-lg rounded-tr-lg border-2 border-dashed border-gray-300 px-3 py-6 text-center transition-all duration-300 hover:border-[#2D5F51]'
                            >
                                <span className='font-semibold text-gray-600'>
                                    Choose images or drag and drop here
                                </span>
                                <span className='text-sm text-gray-400'>
                                    JPG, PNG, WEBP, up to {MAX_IMAGES} images, 10MB each
                                </span>
                                <input
                                    type='file'
                                    id='destinationImages'
                                    accept='image/*'
                                    multiple
                                    onChange={(e) => {
                                        handleImageFiles(e.target.files);
                                        e.target.value = ''; // lets you pick the same file again
                                    }}
                                    className='hidden'
                                />
                            </label>
                        )}

                        {form.images.map((item, index) => (
                            <div key={item.key} className='rounded-lg border border-gray-300 bg-white p-3'>
                                <div className='flex flex-col gap-3 md:flex-row'>
                                    <div className='relative w-full md:w-44'>
                                        <img
                                            src={item.preview || item.url}
                                            alt={`${form.name || 'Destination'} image ${index + 1}`}
                                            className='h-28 w-full rounded-md object-cover'
                                        />
                                        <span className='absolute left-1 top-1 rounded-full bg-black/60 px-2 text-xs font-semibold text-white'>
                                            {index + 1}
                                        </span>
                                        <button
                                            type='button'
                                            onClick={() => handleRemoveImage(index)}
                                            className='absolute right-1 top-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600'
                                            aria-label={`Remove image ${index + 1}`}
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}

                        <p className='text-sm text-gray-600'>
                            {form.images.length}/{MAX_IMAGES} images
                        </p>
                    </div>
                </div>

                <section className='mt-2 flex gap-4 font-semibold'>
                    {/* Go back Button */}
                    <button
                        type='button'
                        onClick={() => router.back()}
                        className='flex cursor-pointer items-center gap-2 rounded-lg bg-[#1F5346] px-4 py-2 text-white duration-200 hover:bg-[#2D5F51]'
                    >
                        <FaArrowAltCircleLeft /> Go Back
                    </button>

                    <button
                        type='button'
                        onClick={resetForm}
                        className='flex cursor-pointer items-center gap-2 rounded-lg bg-[#1F5346] px-4 py-2 text-white duration-200 hover:bg-[#2D5F51]'
                    >
                        <RiResetRightFill /> {editingId ? 'Cancel Edit' : 'Reset'}
                    </button>

                    <button
                        type='submit'
                        disabled={loading}
                        className='cursor-pointer rounded-lg bg-[#2D5F51] px-4 py-2 text-white duration-200 hover:bg-[#1F5346]/80 disabled:opacity-50'
                    >
                        {loading ? 'Saving...' : editingId ? 'Update Destination' : 'Add Destination'}
                    </button>
                </section>
            </form>

            {/* Existing destinations */}
            <h2 className='mt-6 w-fit rounded-lg bg-[#2D5F51] px-2 py-1 text-xl font-semibold text-white'>
                Existing Destinations
            </h2>

            <div className='rounded-lg bg-gray-100 p-4'>
                {status === 'loading' ? (
                    <p className='text-sm text-gray-600'>Loading destinations...</p>
                ) : status === 'failed' ? (
                    <div className='flex items-center gap-3 text-sm text-red-600' role='alert'>
                        <p>{error}</p>
                        <button
                            type='button'
                            onClick={() => dispatch(fetchDestinations())}
                            className='rounded-md border border-red-300 px-3 py-1 hover:bg-red-50'
                        >
                            Retry
                        </button>
                    </div>
                ) : destinations.length === 0 ? (
                    <p className='text-sm text-gray-600'>No destinations yet. Add your first one above.</p>
                ) : (
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                        {destinations.map((dest) => (
                            <div
                                key={dest._id}
                                className={`overflow-hidden rounded-lg border bg-white ${editingId === dest._id ? 'border-[#2D5F51] ring-2 ring-[#2D5F51]' : 'border-gray-300'
                                    }`}
                            >
                                <img
                                    src={dest.images[0]?.url}
                                    alt={dest.name}
                                    className='h-40 w-full object-cover'
                                />
                                <div className='flex flex-col gap-3 p-3'>
                                    <div>
                                        <h3 className='text-lg font-semibold text-gray-800'>{dest.name}</h3>
                                        <p className='text-sm text-gray-500'>
                                            {dest.images.length} {dest.images.length === 1 ? 'image' : 'images'}
                                        </p>
                                    </div>

                                    <div className='flex gap-2'>
                                        <button
                                            type='button'
                                            onClick={() => startEdit(dest)}
                                            className='flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#2D5F51] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#1F5346]'
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        <button
                                            type='button'
                                            onClick={() => handleDelete(dest)}
                                            className='flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50'
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Page;