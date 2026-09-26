import { NavigationRedirects, NavigationSocials, Cities, ScrollCardsData, CarouselImages, ClientImages } from '@/app/types';

export const NAVIGATION_REDIRECTS: NavigationRedirects[] = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'services', label: 'Services', href: '#services' },
    { id: 'destinations', label: 'Destinations', href: '#destinations' },
    { id: 'gallery', label: 'Gallery', href: '#gallery' },
    { id: 'contact', label: 'Contact', href: '#contact' },
];

export const NAVIGATION_SOCIALS: NavigationSocials[] = [
    {
        label: 'Instagram',
        link: 'https://instagram.com',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" > <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg >,
    },
    {
        label: 'Facebook',
        link: 'https://facebook.com',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" > <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" /></svg >,
    },
    {
        label: 'Twitter',
        link: 'https://twitter.com',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" > <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg >,
    },
];

export const CITIES: Cities[] = [
    { name: 'Delhi' },
    { name: 'Mumbai' },
    { name: 'Bangalore' },
];

export const SCROLL_CARDS_DATA: ScrollCardsData[] = [
    {
        id: 1,
        title: 'Explore National Parks',
        desc: 'From the Grand Canyon to Yellowstone.',
        color: 'bg-gradient-to-br from-yellow-300 via-orange-400 to-rose-500',
    },
    {
        id: 2,
        title: 'Coastal Getaways',
        desc: 'Sun, sand, and family fun along the coast.',
        color: 'bg-gradient-to-br from-cyan-300 via-blue-400 to-indigo-600',
    },
    {
        id: 3,
        title: 'City Adventures',
        desc: 'Museums, food, and skyline views.',
        color: 'bg-gradient-to-br from-rose-300 via-pink-500 to-violet-600',
    },
    {
        id: 4,
        title: 'Mountain Escapes',
        desc: 'Hiking trails and cozy cabins.',
        color: 'bg-gradient-to-br from-lime-300 via-emerald-500 to-teal-700',
    },
];

export const CAROUSEL_IMAGES: CarouselImages[] = [
    { image: 'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=1600&auto=format&fit=crop', caption: 'One' },
    { image: 'https://images.unsplash.com/photo-1781499455083-6ccc3beb20cd?q=80&w=1600&auto=format&fit=crop', caption: 'Two' },
    { image: 'https://images.unsplash.com/photo-1776394254711-4a0d7345269a?q=80&w=1600&auto=format&fit=crop', caption: 'Three' },
    { image: 'https://images.unsplash.com/photo-1776394254711-4a0d7345269a?q=80&w=1600&auto=format&fit=crop', caption: 'Four' }
];

export const CLIENT_IMAGES: ClientImages[] = [
    {
        src: 'https://picsum.photos/id/1015/800/600',
        alt: 'Mountain river landscape'
    },
    {
        src: 'https://picsum.photos/id/1016/800/600',
        alt: 'Coastal cliffs'
    },
    {
        src: 'https://picsum.photos/id/1018/800/600',
        alt: 'Mountain valley'
    },
    {
        src: 'https://picsum.photos/id/1039/800/600',
        alt: 'Forest lake'
    },
    {
        src: 'https://picsum.photos/id/1043/800/600',
        alt: 'Desert road'
    },
    {
        src: 'https://picsum.photos/id/1050/800/600',
        alt: 'Countryside path'
    },
    {
        src: 'https://picsum.photos/id/1053/800/600',
        alt: 'Snowy mountain peak'
    },
    {
        src: 'https://picsum.photos/id/1059/800/600',
        alt: 'Ocean cliffside'
    },
    {
        src: 'https://picsum.photos/id/1074/800/600',
        alt: 'Green hillside'
    },
    {
        src: 'https://picsum.photos/id/1080/800/600',
        alt: 'Lakeside scenery'
    }
]