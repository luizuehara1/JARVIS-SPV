import { format } from 'date-fns';
import { Shield, Signal, Cpu, LogIn, LogOut, User } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { auth, signInWithGoogle, logout } from '../lib/firebase';

export const StatusBars: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [user, setUser] = useState(auth.currentUser);
  const vapiConfigured = !!import.meta.env.VITE_VAPI_PUBLIC_KEY;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => {
      clearInterval(timer);
      unsubscribe();
    };
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
      
      <div className="flex gap-4 pointer-events-auto">
        <div className="px-4 py-1 glass-hologram border border-white/5 flex items-center gap-3 backdrop-blur-3xl min-w-[200px] justify-center">
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-1 h-1 rounded-full ${vapiConfigured ? 'bg-jarvis-blue shadow-[0_0_8px_#00f2ff]' : 'bg-jarvis-red shadow-[0_0_8px_#ff3d00]'}`}
          />
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-white/60">
            {vapiConfigured ? 'Neuro-Link: Online' : 'Neuro-Link: Restrict'}
          </span>
        </div>
        
        {user ? (
          <button 
            onClick={logout}
            className="px-4 py-1 glass-hologram border border-white/5 flex items-center gap-2 hover:bg-white/5 transition-colors"
          >
            <LogOut size={12} className="text-white/40" />
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/40">Logout</span>
          </button>
        ) : (
          <button 
            onClick={signInWithGoogle}
            className="px-4 py-1 glass-hologram border border-jarvis-blue/20 flex items-center gap-2 hover:bg-jarvis-blue/10 transition-colors"
          >
            <LogIn size={12} className="text-jarvis-blue" />
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-jarvis-blue">Login</span>
          </button>
        )}
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
