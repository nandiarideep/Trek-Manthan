'use client';
import { useState, useRef } from 'react';
import { FaPlus, FaTimes, FaUpload } from 'react-icons/fa';

const CarouselCard = ({ onAdd, onClose }) => {
    const [modal, setModal] = useState(!!onClose);
    const [preview, setPreview] = useState(null);
    const [form, setForm] = useState({ image: null, description: '' });
    const fileRef = useRef();

    const close = () => {
        setModal(false);
        setPreview(null);
        setForm({ image: null, description: '' });
        onClose?.();
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm((prev) => ({ ...prev, image: file }));
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd?.({ image: preview, description: form.description });
        close();
    };

    return (
        <>
            {!onClose && (
                <button
                    type="button"
                    onClick={() => setModal(true)}
                    className='w-40 h-40 rounded-lg border-2 border-dashed border-[#2D5F51] flex flex-col items-center justify-center gap-2 text-[#2D5F51] hover:bg-[#2D5F51] hover:text-white transition-all duration-300 cursor-pointer'
                >
                    <FaPlus className='text-3xl' />
                    <span className='font-semibold text-sm'>Add Image</span>
                </button>
            )}

            {modal && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-xl p-6 w-full max-w-md flex flex-col gap-4'>
                        <div className='flex justify-between items-center'>
                            <h2 className='bg-[#2D5F51] w-fit py-1 px-2 rounded-lg text-xl font-semibold text-white'>Add Carousel Image</h2>
                            <button type="button" onClick={close} className='cursor-pointer text-gray-500 hover:text-red-500'>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>

                            {/* Image Upload */}
                            <div
                                onClick={() => fileRef.current.click()}
                                className='w-full h-48 rounded-lg border-2 border-dashed border-[#2D5F51] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative hover:bg-gray-50 transition-all'
                            >
                                {preview ? (
                                    <img src={preview} alt="preview" className='w-full h-full object-cover' />
                                ) : (
                                    <>
                                        <FaUpload className='text-3xl text-[#2D5F51]' />
                                        <span className='text-sm text-[#2D5F51] font-semibold mt-2'>Click to upload image</span>
                                    </>
                                )}
                                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className='hidden' required />
                            </div>

                            {/* Description */}
                            <div className='flex flex-col gap-1 relative'>
                                <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-3 left-3 rounded-lg text-sm'>Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className='px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] font-semibold resize-none'
                                    rows={3}
                                />
                            </div>

                            <button
                                type="submit"
                                className='bg-[#2D5F51] text-white py-2 rounded-lg hover:bg-[#1F5346] transition-all duration-200 font-semibold cursor-pointer'
                            >
                                Add
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CarouselCard;
