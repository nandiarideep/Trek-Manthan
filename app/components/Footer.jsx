'use client'

const Footer = () => {
  return (
    <footer className="bg-[#1A4235] text-white py-8 md:px-[100px] px-8 rounded-2xl">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Trek Manthan</h3>
          <p className="text-gray-300">Adventure awaits at every turn</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="/about" className="hover:text-white">About</a></li>
            <li><a href="/services" className="hover:text-white">Services</a></li>
            <li><a href="/destinations" className="hover:text-white">Destinations</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
          <p className="text-gray-300">Email: info@trekmanthan.com</p>
          <p className="text-gray-300">Phone: +91 12345 67890</p>
        </div>
      </div>
      <div className="border-t border-green-900 mt-8 pt-4 text-center text-gray-400">
        <p>&copy; 2026 Trek Manthan Adventures. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer