import { FormUser } from '@/app/componets/form-user';
import React from 'react';

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-tl from-[#03020e] via-[#0e000f] to-[#2f0036] p-6">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/space-stars.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-50"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center lg:flex-row lg:space-x-12">
        {/* Left-side branding and visuals */}
        <div className="text-center lg:text-left">
          <h1 className="text-6xl font-bold tracking-tight text-white md:text-7xl">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">SPACE</span>
            <span className="text-gray-200"> COURSE</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-gray-400">
            Embark on a journey to the final frontier. Explore our courses on space exploration, rocketry, and cosmology.
          </p>
        </div>

        {/* Right-side form card */}
        <FormUser/>
      </div>
    </div>
  );
}