'use client';
import AdminNavbar from '../components/AdminNavbar';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <section className="h-screen overflow-hidden flex p-2 gap-2 font-gasalt">
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
