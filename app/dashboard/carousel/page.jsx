'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowAltCircleLeft, FaTrash, FaEdit, FaTimes, FaUpload } from 'react-icons/fa';
import toast from 'react-hot-toast';
import CarouselCard from '../../components/CarouselCard';

const Page = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editForm, setEditForm] = useState({ image: '', description: '' });
    const [editPreview, setEditPreview] = useState('');
    const fileRef = useRef();

    const handleAdd = (item) => setItems((prev) => [...prev, item]);

    const handleDelete = (index) =>
        setItems((prev) => prev.filter((_, i) => i !== index));

    // ✅ Submit ALL items
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/carousel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(items), // ✅ FIXED
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Carousel updated successfully!');
            } else {
                toast.error(data.message || 'Failed to update carousel');
            }
        } catch (error) {
            toast.error('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (index) => {
        setEditIndex(index);
        setEditForm({
            image: items[index].image,
            description: items[index].description,
        });
        setEditPreview(items[index].image);
    };

    const handleEditFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);

        setEditPreview(preview);
        setEditForm((prev) => ({ ...prev, image: preview }));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();

        setItems((prev) =>
            prev.map((item, i) =>
                i === editIndex
                    ? { image: editPreview, description: editForm.description }
                    : item
            )
        );

        setEditIndex(null);
    };

    return (
        <main className='flex flex-col gap-4'>
            <h1 className='bg-[#2D5F51] w-fit py-1 px-2 rounded-lg text-xl font-semibold text-white'>
                Update Carousel Images
            </h1>

            {/* MAIN FORM */}
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className='flex flex-wrap gap-4'>
                    {items.map((item, i) => (
                        <div key={i} className='w-40 h-40 rounded-lg overflow-hidden relative group'>
                            <img
                                src={item.image}
                                alt={item.description}
                                className='w-full h-full object-cover'
                            />

                            {item.description && (
                                <p className='absolute bottom-0 w-full bg-black/50 text-white text-xs p-1 text-center'>
                                    {item.description}
                                </p>
                            )}

                            <div className='absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                                <button
                                    type="button"
                                    onClick={() => openEdit(i)}
                                    className='bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600'
                                >
                                    <FaEdit className='text-xs' />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(i)}
                                    className='bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600'
                                >
                                    <FaTrash className='text-xs' />
                                </button>
                            </div>
                        </div>
                    ))}

                    <CarouselCard onAdd={handleAdd} />
                </div>

                {/* EDIT MODAL */}
                {editIndex !== null && (
                    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                        <div className='bg-white rounded-xl p-6 w-full max-w-md flex flex-col gap-4'>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-bold text-[#2D5F51]'>
                                    Edit Carousel Image
                                </h2>

                                <button
                                    type="button"
                                    onClick={() => setEditIndex(null)}
                                    className='text-gray-500 hover:text-red-500'
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            {/* ❌ removed nested form */}
                            <div className='flex flex-col gap-5'>
                                <div
                                    onClick={() => fileRef.current.click()}
                                    className='w-full h-48 border-2 border-dashed border-[#2D5F51] flex items-center justify-center cursor-pointer overflow-hidden'
                                >
                                    {editPreview ? (
                                        <img src={editPreview} className='w-full h-full object-cover' />
                                    ) : (
                                        <FaUpload className='text-3xl text-[#2D5F51]' />
                                    )}

                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleEditFile}
                                        className='hidden'
                                    />
                                </div>

                                <textarea
                                    value={editForm.description}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, description: e.target.value })
                                    }
                                    className='px-3 py-3 rounded-lg border'
                                />

                                <button
                                    type="button"
                                    onClick={handleEditSubmit}
                                    className='bg-[#2D5F51] text-white py-2 rounded-lg'
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ACTION BUTTONS */}
                <section className='flex gap-4 mt-2 font-semibold'>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-[#1F5346] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <FaArrowAltCircleLeft /> Go Back
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className='text-white px-4 py-2 rounded-lg bg-[#2D5F51]'
                    >
                        {loading ? 'Updating...' : 'Update Changes'}
                    </button>
                </section>
            </form>
        </main>
    );
};

export default Page;