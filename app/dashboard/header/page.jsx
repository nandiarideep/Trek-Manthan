'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { RiResetRightFill } from "react-icons/ri";

const Page = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    contact: '',
    address: '',
    facebook: '',
    whatsapp: '',
    instagram: '',
    tagline: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://ayhwozxtxlozvkxqwdwz.supabase.co/rest/v1/SOCIAL",
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
          }
        );

        // assuming first row
        const data = res.data?.[0];

        if (data) {
          setFormData({
            email: data.email || "",
            contact: data.contact || "",
            address: data.address || "",
            facebook: data.facebook || "",
            whatsapp: data.whatsapp || "",
            instagram: data.instagram || "",
            tagline: data.tagline || "",
          });
        }
      } catch (error) {
        toast.error("Failed to load data");
        console.error(error);
      }
    };

    fetchData();
  }, []);

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
      email: '',
      contact: '',
      address: '',
      facebook: '',
      whatsapp: '',
      instagram: '',
      tagline: ','
    });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/header', formData);
      toast.success(data.message || 'Header updated successfully!');
      handleReset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='flex flex-col gap-4'>

      {/* SINGLE FORM */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        {/* Header Section */}
        <h1 className='bg-[#2D5F51] w-fit py-1 px-2 rounded-lg text-xl font-semibold text-white'>
          Update Header Information
        </h1>

        <div className='bg-gray-100 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-6 p-4'>

          {/* Email */}
          <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-3 left-3 rounded-lg'>
              Company Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className='px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
              required
            />
          </div>

          {/* Contact */}
          <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-3 left-3 rounded-lg'>
              Company Contact
            </label>
            <input
              type="tel"
              id="contact"
              value={formData.contact}
              onChange={handleChange}
              className='px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
              required
            />
          </div>

          {/* Address */}
          <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-3 left-3 rounded-lg'>
              Company Address
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleChange}
              className='px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
              required
            />
          </div>

        </div>

        {/* Social Section */}
        <h1 className='bg-[#2D5F51] w-fit py-1 px-2 rounded-lg text-xl font-semibold text-white'>
          Update Social Links
        </h1>

        <div className='bg-gray-100 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-6 p-4'>

          {/* Facebook */}
          <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-3 left-3 rounded-lg'>
              Facebook Link
            </label>
            <input
              type="url"
              id="facebook"
              value={formData.facebook}
              onChange={handleChange}
              className='px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
              required
            />
          </div>

          {/* WhatsApp */}
          <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-3 left-3 rounded-lg'>
              WhatsApp Link
            </label>
            <input
              type="url"
              id="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className='px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
              required
            />
          </div>

          {/* Instagram */}
          <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-3 left-3 rounded-lg'>
              Instagram Link
            </label>
            <input
              type="url"
              id="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className='px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
              required
            />
          </div>

        </div>

        {/* Footer Section */}
        <h1 className='bg-[#2D5F51] w-fit py-1 px-2 rounded-lg text-xl font-semibold text-white'>
          Update Footer Information
        </h1>

        <div className='bg-gray-100 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-6 p-4'>

          {/* Tag Line */}
          <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-3 left-3 rounded-lg'>
              Tag Line
            </label>
            <input
              type="tagline"
              id="tagline"
              value={formData.tagline}
              onChange={handleChange}
              className='px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
            />
          </div>

          {/* Email */}
          <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-3 left-3 rounded-lg'>
              Company Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className='px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
              required
            />
          </div>

          {/* Contact */}
          <div className='flex flex-col gap-1 relative'>
            <label className='font-semibold text-white absolute bg-[#2D5F51] px-2 -top-3 left-3 rounded-lg'>
              Company Contact
            </label>
            <input
              type="tel"
              id="contact"
              value={formData.contact}
              onChange={handleChange}
              className='px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D5F51] transition-all duration-300 font-semibold'
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