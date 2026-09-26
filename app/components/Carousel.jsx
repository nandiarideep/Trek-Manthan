'use client'

import { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

const Carousel = () => {
  const slides = [
    {
      bg: 'https://picsum.photos/1600/900?random=1',
      title: 'INDONESIA'
    },
    {
      bg: 'https://picsum.photos/1600/900?random=2',
      title: 'BALI'
    },
    {
      bg: 'https://picsum.photos/1600/900?random=2',
      title: 'BALI'
    },
    {
      bg: 'https://picsum.photos/1600/900?random=2',
      title: 'BALI'
    },
    {
      bg: 'https://picsum.photos/1600/900?random=3',
      title: 'KERALA'
    }
  ]

  const cards = [
    { img: 'https://picsum.photos/200/300?1', title: 'Thailand' },
    { img: 'https://picsum.photos/200/300?2', title: 'Bali' },
    { img: 'https://picsum.photos/200/300?3', title: 'Kerala' }
  ]

  const [index, setIndex] = useState(0)
  const swiperRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (swiperRef.current) swiperRef.current.slideTo(index)
  }, [index])

  return (
    <section className="relative h-screen w-full overflow-hidden">

      {/* Content */}
      <div className="relative z-10 flex justify-between items-center h-full px-10">

        {/* LEFT TEXT */}
        <div className="text-white max-w-xl">
          <h1 className="text-6xl font-bold tracking-wide font-eagle">
            {slides[index].title}
          </h1>

          <p className="mt-4 text-sm opacity-80">
            Explore the beauty of nature and discover amazing places.
          </p>

          <p className="mt-6 font-gasalt cursor-pointer text-[2rem] hover:underline">
            Explore →
          </p>
        </div>

        {/* RIGHT CARDS */}
        <div className="w-[500px]">
          <Swiper
            slidesPerView={2.5}
            spaceBetween={12}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="h-72"
          >
            {cards.map((card, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-full rounded-xl overflow-hidden backdrop-blur-lg hover:scale-105 transition">
                  <img src={card.img} className="w-full h-full object-cover" />
                  <p className="absolute bottom-2 left-2 text-white text-[2rem] font-semibold font-gasalt">{card.title}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}

export default Carousel