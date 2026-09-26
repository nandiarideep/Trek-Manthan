'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import AdminNavbar from '../components/AdminNavbar';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  // useEffect(() => {
  //   const token = sessionStorage.getItem('token');
  //   if (!token) {
  //     router.push('/admin');
  //     return;
  //   }
  // }, [router]);

  return (
    <section className="h-screen overflow-hidden flex p-2 gap-2">
      <Sidebar />
      <div className="flex flex-col w-full gap-2 overflow-hidden">
        <AdminNavbar />
        <div className="bg-gray-100 rounded-lg p-4 w-full flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </section>
  );
}
