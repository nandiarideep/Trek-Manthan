'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTimes, FaTrash, FaPlus } from 'react-icons/fa';

const CityModal = ({ open, onClose, cities, selected, onToggle, onChanged }) => {
  const [newCity, setNewCity] = useState('');
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const addCity = async () => {
    const name = newCity.trim();
    if (!name) return;
    if (cities.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      toast.error('City already exists');
      return;
    }
    try {
      setBusy(true);
      await axios.post('/api/cities', { name });
      setNewCity('');
      await onChanged();
      toast.success('City added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add city');
    } finally {
      setBusy(false);
    }
  };

  const deleteCity = async (city) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span>
          Delete <strong>{city.name}</strong>?
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
              await confirmDelete(city);
            }}
            className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const confirmDelete = async (city) => {
    try {
      setBusy(true);
      await axios.delete('/api/cities', { params: { id: city._id } });
      if (selected.includes(city.name)) onToggle(city.name);
      await onChanged();
      toast.success('City deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete city');
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
          <h3 className='text-lg font-bold text-[#2D5F51]'>Manage Cities</h3>
          <button type='button' onClick={onClose} aria-label='Close' className='cursor-pointer text-gray-500 hover:text-black'>
            <FaTimes />
          </button>
        </div>

        {/* Add new city */}
        <div className='mb-4 flex gap-2 flex justify-center items-center'>
          <input
            type='text'
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCity();
              }
            }}
            placeholder='New city name'
            className='w-full rounded-lg border border-gray-400 p-2 font-semibold focus:outline-[#1F5346]'
          />
          <button
            type='button'
            onClick={addCity}
            disabled={busy || !newCity.trim()}
            className='flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-[#2D5F51] text-[#2D5F51] hover:bg-[#2D5F51] hover:text-white transition duration-200 cursor-pointer'
          >
            <FaPlus size={12} />
          </button>
        </div>

        {/* Select / delete */}
        <p className='mb-2 text-sm text-gray-600'>Tap a city to select or unselect it.</p>
        <div className='flex max-h-64 flex-wrap gap-2 overflow-y-auto'>
          {cities.length === 0 && <p className='text-sm text-gray-500'>No cities yet.</p>}
          {cities.map((city) => {
            const isSelected = selected.includes(city.name);
            return (
              <span
                key={city._id}
                className={`flex items-center overflow-hidden rounded-full border text-sm font-semibold transition ${isSelected ? 'border-[#2D5F51] bg-[#2D5F51] text-white' : 'border-gray-300 bg-gray-100 text-gray-700'
                  }`}
              >
                <button type='button' onClick={() => onToggle(city.name)} className='cursor-pointer py-1 pl-3 pr-2'>
                  {city.name}
                </button>
                <button
                  type='button'
                  onClick={() => deleteCity(city)}
                  disabled={busy}
                  aria-label={`Delete ${city.name}`}
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

export default CityModal;