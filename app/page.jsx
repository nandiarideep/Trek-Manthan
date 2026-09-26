import { Suspense } from 'react';
import Navbar from "../app/components/Navbar";
// import Footer from "@/components/Footer";
import Loader from "../app/components/Loader";
import Landing from '../app/pages/landing/page';
import Services from '../app/pages/services/page';
import Destinations from '../app/pages/destinations/page';
import Gallery from '../app/pages/gallery/page';
import Contact from '../app/pages/contact/page';

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <div className='min-h-[100dvh] w-full font-anton'>
        <Navbar />
        <section id="home">
          <Landing />
        </section>
        <section id="services">
          <Services />
        </section>
        <section id="destinations">
          <Destinations />
        </section>
        <section id="gallery">
          <Gallery />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </div>
    </Suspense>
  )
}

export default page