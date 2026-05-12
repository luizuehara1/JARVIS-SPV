import { format } from 'date-fns';
import { Shield, Signal, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

export const StatusBars: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const vapiConfigured = !!import.meta.env.VITE_VAPI_PUBLIC_KEY && import.meta.env.VITE_VAPI_PUBLIC_KEY !== 'YOUR_VAPI_PUBLIC_KEY';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-10 z-[60] pointer-events-none">
      <div className="flex items-center gap-6 pointer-events-auto">
        <div className="flex flex-col">
          <h1 className="text-[11px] font-black tracking-[0.5em] uppercase text-white glow-blue">
            JARVIS <span className="text-jarvis-blue/60 font-light underline underline-offset-4 decoration-jarvis-blue/20">X.01</span>
          </h1>
          <div className="flex gap-2 items-center mt-1">
            <span className="text-[7px] font-mono text-jarvis-blue/40 uppercase tracking-[0.3em]">Protocol: SPV_ALPHA</span>
            <div className="w-1 h-1 bg-jarvis-blue/20 rounded-full" />
            <span className="text-[7px] font-mono text-jarvis-blue/40 uppercase tracking-[0.3em]">Node: {Math.random().toString(36).substring(2, 6).toUpperCase()}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="px-4 py-1 glass-hologram border border-white/5 flex items-center gap-3 backdrop-blur-3xl">
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-1 h-1 rounded-full ${vapiConfigured ? 'bg-jarvis-blue shadow-[0_0_8px_#00f2ff]' : 'bg-jarvis-red shadow-[0_0_8px_#ff3d00]'}`}
          />
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-white/60">
            {vapiConfigured ? 'Neuro-Link: Online' : 'Neuro-Link: Restrict'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8 pointer-events-auto">
        <div className="text-right">
          <div className="text-xl font-mono leading-none text-white glow-blue font-light tracking-tighter italic">
            {format(time, 'HH:mm:ss')}
          </div>
          <div className="text-[8px] opacity-20 uppercase tracking-[0.4em] font-mono mt-1">
            {format(time, 'EEE MMM dd yyyy')}
          </div>
        </div>
      </div>
    </header>
  );
};
