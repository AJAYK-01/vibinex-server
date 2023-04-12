import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import Button from '../components/Button';
import chromeLogo from '../public/chrome-logo.png'
import Image from 'next/image';

const Navbar = (props: { ctaLink: string }) => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [scrollDown, setScrollDown] = useState(false);
  const changeNavbar = () => {
    setShowNavbar(!showNavbar);
  };
  useEffect(() => {
    const changeColor = () => {
      if (window.scrollY >= 90) {
        setScrollDown(true);
      } else {
        setScrollDown(false);
      }
    };
    window.addEventListener('scroll', changeColor);
  }, []);

  return (
    <div
      className={
        'fixed left-0 top-0 w-full z-10 ease-in duration-300 border-b-secondary-dark border-b-2' + (scrollDown ? ' bg-primary-light' : '')
      }
    >
      <div className={
        'max-w-[1240px] m-auto flex justify-between items-center p-4 ' +
        (scrollDown ? ' text-secondary-dark' : ' text-primary-light')
      }>
        <Link href='/'>
          <h1 className='font-bold text-4xl'>
            Vibinex
          </h1>
        </Link>
        <ul className='hidden sm:flex'>
          <li className='p-4'>
            <Link href='/'>Home</Link>
          </li>
          <li className='p-4'>
            <Link href='#whyus'>Why Us?</Link>
          </li>
          <li className='p-4'>
            <Link href='#features'>Features</Link>
          </li>
          <li className='p-4'>
            <Link href='#steps'>Steps</Link>
          </li>
          <li className='p-4'>
            <Link href='#trust'>Trust Us</Link>
          </li>
          <li className='p-4'>
            <Link href={props.ctaLink} target="_blank" className="rounded bg-primary-main text-secondary-main py-2 px-4 font-semibold">
              Download
              <Image src={chromeLogo} alt="chrome extension logo" className="inline ml-1 w-6"></Image>
            </Link>
          </li>
        </ul>

        {/* Mobile Button */}
        <div onClick={changeNavbar}
          className={
            'block sm:hidden z-10' + (scrollDown ? ' text-secondary-dark' : ' text-primary-light')
          }
        >
          {showNavbar ? (
            <AiOutlineClose size={20} />
          ) : (
            <AiOutlineMenu size={20} />
          )}
        </div>
        {/* Mobile Menu */}
        <div
          className={
            'sm:hidden absolute flex justify-center items-center w-full h-screen bg-secondary-dark text-center ease-in duration-300' +
            (showNavbar ? ' left-0 top-0 right-0 bottom-0' : ' left-[-100%] top-0 right-0 bottom-0')
          }
        >
          <ul>
            <li onClick={changeNavbar} className='p-4 text-4xl text-secondary-main hover:text-secondary-light'>
              <Link href='/'>Home</Link>
            </li>
            <li onClick={changeNavbar} className='p-4 text-4xl text-secondary-main hover:text-secondary-light'>
              <Link href='#whyus'>Why Us?</Link>
            </li>
            <li onClick={changeNavbar} className='p-4 text-4xl text-secondary-main hover:text-secondary-light'>
              <Link href='#features'>Features</Link>
            </li>
            <li onClick={changeNavbar} className='p-4 text-4xl text-secondary-main hover:text-secondary-light'>
              <Link href='#steps'>Steps</Link>
            </li>
            <li onClick={changeNavbar} className='p-4 text-4xl text-secondary-main hover:text-secondary-light'>
              <Link href='#trust'>Trust Us</Link>
            </li>
            <li onClick={changeNavbar} className='p-4 text-4xl text-secondary-main hover:text-secondary-light'>
              <Button variant='text' href={props.ctaLink} target="_blank">Download Now!</Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Navbar;