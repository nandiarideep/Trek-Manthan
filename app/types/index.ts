import type { ReactNode } from 'react';

export type NavigationRedirects = {
    id: string
    label: string
    href: string
}

export type NavigationSocials = {
    label: string
    link: string
    icon: ReactNode
}

export type Cities = {
    name: string
}

export type ScrollCardsData = {
    id: number
    title: string
    desc: string
    color: string
}

export type CarouselImages = {
    image: string
    caption: string
}

export type ClientImages = {
    src: string
    alt: string
}