'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { NAVIGATION_REDIRECTS, NAVIGATION_SOCIALS } from '../constants';
import StaggeredMenu from '@/components/StaggeredMenu';
import logo from '@/assets/logo.jpeg';
import { FaWhatsapp } from 'react-icons/fa';

const Navbar = () => {
    const [socialLinks, setSocialLinks] = useState({ whatsapp: '', facebook: '', instagram: '' });

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const loadData = async () => {
            try {
                const { data } = await axios.get('/api/info', { signal });
                const settings = data?.settings;
                if (settings && !signal.aborted) {
                    setSocialLinks({
                        whatsapp: settings.whatsapp || '',
                        facebook: settings.facebook || '',
                        instagram: settings.instagram || '',
                    });
                }
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error('Failed to load info:', error);
                }
            }
        };

        loadData();

        return () => controller.abort();
    }, []);

    const navSocialIcons = [
        {
            label: 'Instagram',
            link: socialLinks.instagram,
            icon: NAVIGATION_SOCIALS.find((social) => social.label === 'Instagram')?.icon,
        },
        {
            label: 'Facebook',
            link: socialLinks.facebook,
            icon: NAVIGATION_SOCIALS.find((social) => social.label === 'Facebook')?.icon,
        },
        {
            label: 'WhatsApp',
            link: socialLinks.whatsapp,
            icon: <FaWhatsapp size={18} />,
        },
    ].filter((social) => social.link);

    return (
        <main className="fixed top-0 left-0 w-full z-50 font-Quicksand" style={{ height: '50px' }}>
            {/* Menu Component */}
            <StaggeredMenu
                items={NAVIGATION_REDIRECTS}
                colors={['#1d1f57', '#2d7a63']}
                accentColor="#1e584a"
                position="right"
                displaySocials={false}
                displayItemNumbering={false}
                isFixed
                logoUrl={logo.src}
                navSocialIcons={navSocialIcons}
            />
        </main>
    )
};

export default Navbar;
