
import React, { useEffect, useRef } from 'react';

const SmoothCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    
    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animateCursor = () => {
      const speed = 0.1;
      cursorX += (mouseX - cursorX) * speed;
      cursorY += (mouseY - cursorY) * speed;

      cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px)`;
      cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;

      requestAnimationFrame(animateCursor);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animateCursor();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999] hidden md:block">
        <span className="text-sm text-gray-500 absolute top-4 left-1/2 transform -translate-x-1/2 hidden md:block">
          Move your mouse around
        </span>
        <span className="text-sm text-gray-500 absolute top-4 left-1/2 transform -translate-x-1/2 block md:hidden">
          Tap anywhere to see the cursor
        </span>
      </div>
      
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full pointer-events-none z-[9999] opacity-50 mix-blend-multiply hidden md:block"
        style={{ transition: 'none' }}
      />
      
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-violet-600 rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{ transition: 'none' }}
      />
    </>
  );
};

export default SmoothCursor;
