"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineCaretDown, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import AccountMenu from "./AccountMenu";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = () => setNav(!nav);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className='max-w-7xl mx-auto px-6 flex justify-between items-center'>
        
        {/* LOGO */}
        <Link href="/" className='flex items-center gap-3 z-50'>
          <Image src="/westgateLogo.png" alt="Logo" width={45} height={45} />
          <span className={`font-black text-xl tracking-tighter transition-colors duration-300 ${
            (isScrolled || nav) ? 'text-black' : 'text-white'
          }`}>
            SINDJELIC FC
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <ul className={`hidden md:flex gap-8 font-bold text-sm uppercase items-center ${
          isScrolled ? 'text-black' : 'text-white'
        }`}>
          <li className='hover:text-red-600 transition'><Link href="/pages/news">News</Link></li>

          <li className='group relative py-4 cursor-pointer'>
            <div className='flex items-center gap-1 hover:text-red-600 transition'>
              MEN <AiOutlineCaretDown size={12} />
            </div>
            <ul className='absolute hidden group-hover:block top-full left-0 bg-white text-black shadow-xl min-w-40 border-t-4 border-red-600'>
               <li className='px-4 py-3 hover:bg-gray-100 hover:text-red-600 border-b border-gray-50'><Link href="/pages/men/seniors">Seniors</Link></li>
               <li className='px-4 py-3 hover:bg-gray-100 hover:text-red-600'><Link href="/pages/men/reserves">Reserves</Link></li>
            </ul>
          </li>

          <li className='group relative py-4 cursor-pointer'>
            <div className='flex items-center gap-1 hover:text-red-600 transition'>
              WOMEN <AiOutlineCaretDown size={12} />
            </div>
            <ul className='absolute hidden group-hover:block top-full left-0 bg-white text-black shadow-xl min-w-40 border-t-4 border-red-600'>
               <li className='px-4 py-3 hover:bg-gray-100 hover:text-red-600 border-b border-gray-50'><Link href="/pages/women/seniors">Seniors</Link></li>
               <li className='px-4 py-3 hover:bg-gray-100 hover:text-red-600'><Link href="/pages/women/reserves">Reserves</Link></li>
            </ul>
          </li>

          <li className='hover:text-red-600 transition'><Link href="/pages/juniors">Juniors</Link></li>

          <li className='hover:text-red-600 transition'><Link href="/pages/aboutUs">About Us</Link></li>

          {/* Account Menu - Perfectly Aligned */}
          <li className='ml-4 flex items-center'>
            <AccountMenu />
          </li>
        </ul>

        {/* MOBILE BUTTON */}
        <div onClick={handleNav} className='md:hidden z-50 cursor-pointer'>
          {nav ? <AiOutlineClose size={25} className="text-black" /> : <AiOutlineMenu size={25} className={isScrolled ? 'text-black' : 'text-white'} />}
        </div>

        {/* MOBILE MENU OVERLAY */}
        <div className={
        nav 
        ? 'fixed inset-0 w-full h-screen bg-white text-black flex flex-col items-center text-center ease-in duration-300 overflow-y-auto pt-24 pb-10'
        : 'fixed -left-full h-screen ease-in duration-300'
        }>
        <ul className='uppercase font-bold text-2xl space-y-8 flex flex-col items-center w-full px-10'>
            <li onClick={handleNav}><Link href="/pages/news">News</Link></li>
            <li onClick={handleNav}><Link href="/pages/men/seniors">Men</Link></li>
            <li onClick={handleNav}><Link href="/pages/women/seniors">Women</Link></li>
            <li onClick={handleNav}><Link href="/pages/juniors">Juniors</Link></li>
            <li onClick={handleNav}><Link href="/pages/aboutUs">About Us</Link></li>
            
            {/* Account Menu wrapper with extra padding below to ensure scrolling space */}
            <li className='pt-6 pb-20 relative w-full flex justify-center'>
            <div className="scale-125">
                <AccountMenu />
            </div>
            </li>
        </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;