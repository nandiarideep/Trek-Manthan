'use client';

import { NAVIGATION_REDIRECTS, NAVIGATION_SOCIALS } from '../constants';
import StaggeredMenu from '@/components/StaggeredMenu';
import logo from '@/assets/logo.jpeg';

const Navbar = () => (
    <div className="fixed top-0 left-0 w-full z-50 font-Quicksand" style={{ height: '50px' }}>
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
            navSocialIcons={NAVIGATION_SOCIALS}
        />
    </div>
);

export default Navbar;
