import { motion } from 'motion/react';
import React from 'react';

export const HUDLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-jarvis-blue font-sans select-none flex flex-col">
      {/* Background Particles - More subtle and cinematic */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-[1px] bg-jarvis-blue rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              opacity: Math.random()
            }}
            animate={{ 
              y: [null, '-=150px'],
              opacity: [0, 0.4, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.02)_0%,transparent_70%)]">
        {children}
      </div>

      {/* Subtle Scanline Overlay */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"
      />
    </div>
  );
};
