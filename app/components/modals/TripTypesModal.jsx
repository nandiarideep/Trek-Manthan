'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTimes, FaTrash, FaPlus } from 'react-icons/fa';

const TripTypeModal = ({ open, onClose, tripTypes, selected, onToggle, onChanged }) => {
    const [newTripType, setNewTripType] = useState('');
    const [busy, setBusy] = useState(false);

    if (!open) return null;

    const addTripType = async () => {
        const name = newTripType.trim();
        if (!name) return;
        if (tripTypes.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
            toast.error('Trip type already exists');
            return;
        }
        try {
            setBusy(true);
            await axios.post('/api/tripTypes', { name });
            setNewTripType('');
            await onChanged();
            toast.success('Trip type added');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add tripType');
        } finally {
            setBusy(false);
        }
    };

    const deleteTripType = async (tripType) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <span>
                    Delete <strong>{tripType.name}</strong>?
                </span>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            await confirmDelete(tripType);
                        }}
                        className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ));
    };

    const confirmDelete = async (tripType) => {
        try {
            setBusy(true);
            await axios.delete('/api/tripTypes', { params: { id: tripType._id } });
            if (selected.includes(tripType.name)) onToggle(tripType.name);
            await onChanged();
            toast.success('Trip type deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete trip type');
        } finally {
            setBusy(false);
        }
    };

    return createPortal(
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-gasalt'
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className='w-full max-w-3xl rounded-lg bg-white p-4 shadow-xl'>
                <div className='mb-3 flex items-center justify-between'>
                    <h3 className='text-lg font-bold text-[#2D5F51]'>Manage Trip Types</h3>
                    <button type='button' onClick={onClose} aria-label='Close' className='cursor-pointer text-gray-500 hover:text-black'>
                        <FaTimes />
                    </button>
                </div>

                {/* Add new tripType */}
                <div className='mb-4 flex gap-2 flex justify-center items-center'>
                    <input
                        type='text'
                        value={newTripType}
                        onChange={(e) => setNewTripType(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addTripType();
                            }
                        }}
                        placeholder='New Trip Type'
                        className='w-full rounded-lg border border-gray-400 p-2 font-semibold focus:outline-[#1F5346]'
                    />
                    <button
                        type='button'
                        onClick={addTripType}
                        disabled={busy || !newTripType.trim()}
                        className='flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-[#2D5F51] text-[#2D5F51] hover:bg-[#2D5F51] hover:text-white transition duration-200 cursor-pointer'
                    >
                        <FaPlus size={12} />
                    </button>
                </div>

                {/* Select / delete */}
                <p className='mb-2 text-sm text-gray-600'>Tap a Trip Type to select or unselect it.</p>
                <div className='flex max-h-64 flex-wrap gap-2 overflow-y-auto'>
                    {tripTypes.length === 0 && <p className='text-sm text-gray-500'>No tripTypes yet.</p>}
                    {tripTypes.map((tripType) => {
                        const isSelected = selected.includes(tripType.name);
                        return (
                            <span
                                key={tripType._id}
                                className={`flex items-center overflow-hidden rounded-full border text-sm font-semibold transition ${isSelected ? 'border-[#2D5F51] bg-[#2D5F51] text-white' : 'border-gray-300 bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <button type='button' onClick={() => onToggle(tripType.name)} className='cursor-pointer py-1 pl-3 pr-2'>
                                    {tripType.name}
                                </button>
                                <button
                                    type='button'
                                    onClick={() => deleteTripType(tripType)}
                                    disabled={busy}
                                    aria-label={`Delete ${tripType.name}`}
                                    className='cursor-pointer py-1 pr-3 opacity-70 hover:text-red-500 hover:opacity-100'
                                >
                                    <FaTrash size={11} />
                                </button>
                            </span>
                        );
                    })}
                </div>

                <div className='mt-4 flex items-center justify-between'>
                    <span className='text-sm text-gray-600'>{selected.length} selected</span>
                    <button
                        type='button'
                        onClick={onClose}
                        className='rounded-lg bg-[#1F5346] px-4 py-1 text-white hover:bg-[#2D5F51] cursor-pointer'
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TripTypeModal;