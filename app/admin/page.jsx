'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { loginUser } from '../services/auth';
import Image from 'next/image';
import logo from '@/assets/logo.jpeg';

const AdminLogin = () => {
  const [username, setUsername] = useState(() => {
    if (typeof document === 'undefined') return '';
    const savedUsername = document.cookie.split('; ').find(row => row.startsWith('username='))?.split('=')[1];
    return savedUsername ? decodeURIComponent(savedUsername) : '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() =>
    typeof document !== 'undefined' && document.cookie.split('; ').some(row => row.startsWith('username='))
  );
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const res = await loginUser({ username, password });
      sessionStorage.setItem('token', res.data.token);

      if (rememberMe) {
        document.cookie = `username=${encodeURIComponent(username)}; max-age=${30 * 24 * 60 * 60}; path=/`;
      } else {
        document.cookie = 'username=; max-age=0; path=/';
      }

      toast.success('Login successful!');
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className='font-gasalt'>
      <Toaster position="top-right" />
      <div className='min-h-screen flex justify-center items-center bg-gray-100'>
        {/* Background Watermark */}
        <Image
          src={logo}
          alt="Logo"
          fill
          className="object-contain opacity-10 z-0"
        />
        <form onSubmit={submit} className='bg-white/90 p-6 rounded-lg shadow-lg w-96 space-y-4 flex flex-col items-center relative z-10'>

          <h2 className="text-2xl font-bold text-center">Admin Dashboard Login</h2>

          <input type="text" name="username" autoComplete="username" placeholder="Username" value={username} required className="font-semibold w-full border border-gray-400 p-2 rounded-lg focus:outline-[#1F5346] transition-all duration-300" onChange={e => setUsername(e.target.value)} />
          <div className="relative w-full">
            <input type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" placeholder="Password" value={password} required className="font-semibold w-full border border-gray-400 p-2 pr-10 rounded-lg focus:outline-[#1F5346] transition-all duration-300" onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 w-full">
            <input type="checkbox" className='w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500' id="remember" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
            <label htmlFor="remember" className="text-sm font-semibold text-gray-600 cursor-pointer">Remember me</label>
          </div>
          <button className='bg-[#1F5346] hover:bg-[#2D5F51] cursor-pointer duration-200 transition-all ease-in-out text-white px-2 py-1 rounded-lg'>Login</button>
        </form>
      </div>
    </main>
  )
}

export default AdminLogin