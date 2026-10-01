'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaUser, FaCog, FaFile, FaFolder, FaDatabase, FaGlobe } from "react-icons/fa";


import logo from '@/assets/logo.jpeg';
import Image from 'next/image';

/* ---------------- Sidebar Menu Configuration ---------------- */
const SIDEBAR_MENUS = [
    { id: 1, name: "Dashboard", slug: "dashboard", icon: FaHome },
    { id: 2, name: "Website Info", slug: "dashboard/website-info", icon: FaGlobe },
    { id: 3, name: "Enquiries", slug: "dashboard/enquiries", icon: FaGlobe },
    { id: 4, name: "Bookings", slug: "dashboard/bookings", icon: FaFile },
    { id: 5, name: "Folders", slug: "dashboard/folders", icon: FaFolder },
    { id: 6, name: "Database", slug: "dashboard/database", icon: FaDatabase },
    { id: 7, name: "Users", slug: "dashboard/users", icon: FaUser },
    { id: 8, name: "Settings", slug: "dashboard/settings", icon: FaCog },
];

/* ---------------- Sidebar Item ---------------- */
function SidebarItem({ item }) {
    const IconComponent = item.icon;
    const pathname = usePathname();
    const isActive = pathname === `/${item.slug}`;

    return (
        <li>
            <Link
                href={`/${item.slug}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${isActive
                        ? "bg-[#2D5F51] text-white"
                        : "hover:bg-[#2D5F51] text-[#2D5F51] hover:text-white"
                    }`}
            >
                <IconComponent className="text-lg flex-shrink-0" />
                <span className="whitespace-nowrap transition-all duration-300 group-hover:block hidden font-semibold">
                    {item.name}
                </span>
            </Link>
        </li>
    );
}

const Sidebar = () => {
    return (
        <div className='bg-gray-100 p-3 rounded-lg flex flex-col transition-all duration-300 hover:w-48 w-16 group'>
            <div className="flex items-center justify-center gap-3 text-indigo-600 h-5 mb-5">
                {/* Brand Logo */}
                <Image
                    src={logo}
                    alt="Logo"
                    className="h-8 w-8 rounded-lg object-contain"
                />
            </div>

            <nav className="flex-1">
                <ul className="space-y-2">
                    {SIDEBAR_MENUS.map((item) => (
                        <SidebarItem
                            key={item.id}
                            item={item}
                        />
                    ))}
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar