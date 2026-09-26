import logo from '../../assets/logo.jpeg';
import Image from 'next/image';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f6f2e9] font-anton">
      {/* Rotating Ring */}
      <div className="relative flex items-center justify-center w-40 h-40 rounded-full border-4 border-[#1f4d3a]/30 animate-spin">
        
        {/* Logo */}
        <Image
          src={logo}
          alt="Trekmathan Adventures"
          className="w-24 h-24 object-contain animate-pulse"
        />
      </div>

      {/* Text */}
      <p className="mt-6 text-sm tracking-widest font-semibold text-[#1f4d3a] uppercase tracking-widest">
        Loading your adventure
      </p>
    </div>
  );
};

export default Loader;
