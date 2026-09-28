'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BiFullscreen } from "react-icons/bi";
import { IoMdNotifications } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminNavbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();

    /* ---------------- Get User (from localStorage/sessionStorage or fallback) ---------------- */
    const [user, setUser] = useState({ name: "User" });

    /* ---------------- Toggle Fullscreen ---------------- */
    const toggleFullscreen = () => {
        const doc = document.documentElement;
        if (!document.fullscreenElement) doc.requestFullscreen?.();
        else document.exitFullscreen?.();
    };

    /* ---------------- Dropdown Items ---------------- */
    const menuItems = [
        { label: "Settings", to: "/settings" },
        { label: "Change Password", to: "/change-password" },
        { label: "Logout", to: "/admin", action: "logout" },
    ];

    const toggleDropdown = () => setDropdownOpen((prev) => !prev);

    /* ---------------- Handle Menu Click (No Redux Required) ---------------- */
    const handleItemClick = async (item) => {
        if (item.action === "logout") {
            // Clear tokens & user info from storage
            localStorage.removeItem("token");
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("user");

            toast.success("Logged out successfully");

            router.replace(item.to);
            setDropdownOpen(false);
            return;
        }

        setDropdownOpen(false);
    };

    useEffect(() => {
        try {
            const stored =
                localStorage.getItem("user") || sessionStorage.getItem("user");
            if (stored) setUser(JSON.parse(stored));
        } catch {
            // invalid JSON or storage unavailable, keep the fallback
        }
    }, []);

    /* ---------------- Close Dropdown on Outside Click ---------------- */
    useEffect(() => {
        const onDocClick = (e) => {
            if (!e.target.closest?.("[data-user-dropdown]")) setDropdownOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    return (
        <nav className='p-2 bg-gray-100 rounded-lg h-12 flex items-center justify-between gap-4'>
            <p className="font-bold text-[#2D5F51]">
                Trek Manthan Adventures
            </p>
            <div className="flex items-center gap-2 px-2">
                {/* Fullscreen */}
                <button
                    title="Fullscreen"
                    onClick={toggleFullscreen}
                    className="flex items-center justify-center w-8 h-8 bg-[#2D5F51] hover:bg-white rounded-[10px] transition cursor-pointer duration-200"
                >
                    <BiFullscreen className="text-xl text-white hover:text-[#2D5F51]" />
                </button>

                {/* Notifications */}
                <button title="Notifications" className='bg-[#2D5F51] hover:bg-white rounded-[10px] transition cursor-pointer w-8 h-8 flex items-center justify-center duration-200'>
                    <IoMdNotifications className="w-7 h-7 cursor-pointer p-1 rounded-[10px] text-white hover:text-[#2D5F51]" />
                </button>

                {/* Dropdown */}
                <div
                    className="relative flex items-center gap-2 cursor-pointer"
                    data-user-dropdown
                >
                    <div
                        onClick={toggleDropdown}
                        className="flex items-center gap-2"
                        data-user-dropdown
                    >
                        <h1
                            className="hidden sm:flex items-center gap-1 text-md font-semibold bg-[#2D5F51] hover:bg-white text-white hover:text-[#2D5F51] p-1 px-2 rounded-[10px] duration-200"
                            title={user?.name || "User"}
                        >
                            {user?.name || "User"} <FaAngleDown />
                        </h1>
                    </div>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div
                            className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-[10px] shadow-lg text-gray-700 z-50"
                            data-user-dropdown
                        >
                            <ul className="py-1" data-user-dropdown>
                                {menuItems.map((item) => (
                                    <li key={item.label} data-user-dropdown>
                                        <Link
                                            href={item.to}
                                            onClick={(e) => {
                                                if (item.action) {
                                                    e.preventDefault();
                                                    handleItemClick(item);
                                                } else {
                                                    setDropdownOpen(false);
                                                }
                                            }}
                                            className="flex items-center justify-start px-2 p-1 text-sm font-semibold hover:bg-gray-100 w-full"
                                            data-user-dropdown
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}