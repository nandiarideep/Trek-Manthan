'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { RiResetRightFill } from "react-icons/ri";
import { FaPlus, FaTimes } from 'react-icons/fa';
import CityModal from '../../components/modals/CityModal';

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    videoLink: '',
    cityNames: [],
    email: '',
    contact: '',
    address: '',
    facebook: '',
    whatsapp: '',
    instagram: '',
    tagline: '',
    secondTagline: '',
  });
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [cityModalOpen, setCityModalOpen] = useState(false);

  const fetchCities = useCallback(async () => {
    setCitiesLoading(true);
    try {
      const { data } = await axios.get('/api/cities');
      setCities(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load cities');
    } finally {
      setCitiesLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/info');
        if (data.settings) {
          setFormData((prev) => ({ ...prev, ...data.settings }));
        }
      } catch {
        toast.error("Failed to load data");
      }
    };

    fetchCities();
    fetchData();
  }, [fetchCities]);

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle reset
  const handleReset = () => {
    setFormData({
      videoLink: '',
      cityNames: [],
      email: '',
      contact: '',
      address: '',
      facebook: '',
      whatsapp: '',
      instagram: '',
      tagline: '',
      secondTagline: '',
    });
  };

  const handleCityChange = (cityName) => {
    setFormData((prev) => ({
      ...prev,
      cityNames: prev.cityNames.includes(cityName)
        ? prev.cityNames.filter((name) => name !== cityName)
        : [...prev.cityNames, cityName],
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/info', formData);
      toast.success(data.message || 'Info updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='flex flex-col gap-4'>
      <Toaster position="bottom-right" />

      {/*Form Start */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <h1 className='bg-[#2D5F51] w-fit py-1 px-2 rounded-lg text-xl font-semibold text-white'>
          Update Page Information
        </h1>
        <div className='bg-gray-100 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-8 p-4'>

          {/* BG - Video Link */}
          {/* <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-6 left-0 rounded-t-lg'>
              Bg - Video Link
            </label>
            <input
              type="url"
              id="videoLink"
              value={formData.videoLink}
              onChange={handleChange}
              className='px-3 py-2 rounded-b-lg rounded-tr-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
              required
            />
          </div> */}

          {/* Tag Line */}
          <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-6 left-0 rounded-t-lg'>
              Tag Line
            </label>
            <textarea
              type="text"
              id="tagline"
              value={formData.tagline}
              onChange={handleChange}
              className='px-3 py-2 rounded-b-lg rounded-tr-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
            />
          </div>

          {/* City Names */}
          <div className='flex flex-col gap-2 relative rounded-lg border border-gray-300 p-3 pt-4'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-6 left-0 rounded-t-lg'>
              City Names
            </label>

            {citiesLoading ? (
              <p className='text-sm text-gray-600'>Loading cities...</p>
            ) : (
              <div className='flex gap-2 '>
                <div className='flex flex-wrap items-center gap-2'>
                  {formData.cityNames.map((name) => (
                    <span
                      key={name}
                      className='flex items-center gap-1.5 rounded-full bg-[#2D5F51] px-3 py-1 text-sm font-semibold text-white'
                    >
                      {name}
                      <button
                        type='button'
                        onClick={() => handleCityChange(name)}
                        aria-label={`Remove ${name}`}
                        className='cursor-pointer hover:text-red-200'
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  ))}

                  {formData.cityNames.length === 0 && (
                    <span className='text-sm text-gray-500'>No cities selected</span>
                  )}
                </div>

                <button
                  type='button'
                  onClick={() => setCityModalOpen(true)}
                  aria-label='Manage cities'
                  className='flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-[#2D5F51] text-[#2D5F51] hover:bg-[#2D5F51] hover:text-white transition duration-200 cursor-pointer'
                >
                  <FaPlus size={12} />
                </button>

              </div>
            )}

            <span className='text-sm text-gray-600' aria-live='polite'>
              {formData.cityNames.length} selected
            </span>
          </div>
          
          {/* Modal Component */}
          <CityModal
            open={cityModalOpen}
            onClose={() => setCityModalOpen(false)}
            cities={cities}
            selected={formData.cityNames}
            onToggle={handleCityChange}
            onChanged={fetchCities}
          />

          {/* 2nd Tag Line */}
          <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-6 left-0 rounded-t-lg'>
              2nd Tag Line
            </label>
            <textarea
              type="secondTagline"
              id="secondTagline"
              value={formData.secondTagline}
              onChange={handleChange}
              className='px-3 py-2 rounded-b-lg rounded-tr-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
            />
          </div>

          {/* Email */}
          {/* <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-6 left-0 rounded-t-lg'>
              Company Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className='px-3 py-2 rounded-b-lg rounded-tr-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
              required
            />
          </div> */}

          {/* Contact */}
          {/* <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-6 left-0 rounded-t-lg'>
              Company Contact
            </label>
            <input
              type="tel"
              id="contact"
              value={formData.contact}
              onChange={handleChange}
              className='px-3 py-2 rounded-b-lg rounded-tr-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
              required
            />
          </div> */}

          {/* Address */}
          {/* <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-6 left-0 rounded-t-lg'>
              Company Address
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleChange}
              className='px-3 py-2 rounded-b-lg rounded-tr-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
              required
            />
          </div> */}
        </div>

        {/* Social Section */}
        <h1 className='bg-[#2D5F51] w-fit py-1 px-2 rounded-lg text-xl font-semibold text-white'>
          Update Social Links
        </h1>

        <div className='bg-gray-100 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-6 p-4'>

          {/* Facebook */}
          <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-6 left-0 rounded-t-lg'>
              Facebook Link
            </label>
            <input
              type="url"
              id="facebook"
              value={formData.facebook}
              onChange={handleChange}
              className='px-3 py-2 rounded-b-lg rounded-tr-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
              required
            />
          </div>

          {/* WhatsApp */}
          <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-6 left-0 rounded-t-lg'>
              WhatsApp Link
            </label>
            <input
              type="url"
              id="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className='px-3 py-2 rounded-b-lg rounded-tr-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
              required
            />
          </div>

          {/* Instagram */}
          <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-6 left-0 rounded-t-lg'>
              Instagram Link
            </label>
            <input
              type="url"
              id="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className='px-3 py-2 rounded-b-lg rounded-tr-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
              required
            />
          </div>
        </div>

        {/* Buttons */}
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