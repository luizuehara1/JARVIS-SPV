import { motion } from 'motion/react';
import React from 'react';

export const DiagnosticOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Corner Brackets */}
      <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-white/10" />
      <div className="absolute top-10 right-10 w-20 h-20 border-t border-r border-white/10" />
      <div className="absolute bottom-10 left-10 w-20 h-20 border-b border-l border-white/10" />
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-white/10" />

      {/* Cinematic Orbital HUD Left */}
      <motion.div 
        className="absolute top-1/2 -left-20 w-80 h-80 rounded-full border border-jarvis-blue/[0.05] flex items-center justify-center -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-[90%] h-[90%] rounded-full border-t border-jarvis-blue/20" />
        <div className="absolute w-[85%] h-[85%] rounded-full border-b border-white/5" />
        <div className="absolute w-[80%] h-[80%] rounded-full border-l border-jarvis-blue/10" />
      </motion.div>

      {/* Cinematic Orbital HUD Right */}
      <motion.div 
        className="absolute top-1/2 -right-20 w-80 h-80 rounded-full border border-white/[0.02] flex items-center justify-center -translate-y-1/2"
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-[95%] h-[95%] rounded-full border-r border-white/5" />
        <div className="absolute w-[70%] h-[70%] rounded-full border-t border-jarvis-blue/5" />
      </motion.div>

      {/* Random Data Streams (Lateral) */}
      <div className="absolute top-1/4 left-12 flex flex-col space-y-1 font-mono text-[7px] text-white/5 opacity-40">
        {[...Array(12)].map((_, i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
          >
            SYS_LOG::0x{Math.random().toString(16).slice(2, 6).toUpperCase()}..{Math.random().toString(16).slice(2, 4)}
          </motion.span>
        ))}
      </div>

      <div className="absolute bottom-1/4 right-12 flex flex-col items-end space-y-1 font-mono text-[7px] text-white/5 opacity-40 text-right">
        {[...Array(10)].map((_, i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.1, 0.6, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
          >
            NET_RECV::{Math.floor(Math.random() * 999)} KB/S [OK]
          </motion.span>
        ))}
      </div>

      {/* Subtle Center Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
        <div className="w-12 h-[0.5px] bg-jarvis-blue mb-1" />
        <div className="w-12 h-[0.5px] bg-jarvis-blue" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[0.5px] h-12 bg-jarvis-blue mx-1" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[0.5px] h-12 bg-jarvis-blue" />
      </div>
    </div>
  );
};
