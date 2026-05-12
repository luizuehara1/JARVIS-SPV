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
    <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-12 z-[60] pointer-events-none">
      <div className="flex items-center gap-8 pointer-events-auto">
        <div className="flex flex-col">
          <h1 className="text-[14px] font-black tracking-[0.6em] uppercase text-white glow-blue">
            JARVIS <span className="text-jarvis-blue/60 font-light underline underline-offset-8 decoration-jarvis-blue/20">X.01</span>
          </h1>
          <div className="flex gap-3 items-center mt-2">
            <span className="text-[8px] font-mono text-jarvis-blue/40 uppercase tracking-[0.3em]">Protocol: SPV_ALPHA</span>
            <div className="w-1 h-1 bg-jarvis-blue/20 rounded-full" />
            <span className="text-[8px] font-mono text-jarvis-blue/40 uppercase tracking-[0.3em]">Neural_Link: Established</span>
          </div>
        </div>

        <div className="h-10 w-px bg-white/5 mx-2" />

        <div className="flex flex-col">
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">Authorized Personnel</span>
          <span className="text-[10px] text-white/70 font-light tracking-widest mt-0.5">{user?.displayName?.toUpperCase() || 'ANONYMOUS'}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6 pointer-events-auto">
        <div className="px-6 py-2 glass-hologram border border-white/5 flex items-center gap-4 backdrop-blur-3xl">
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-1.5 h-1.5 rounded-full ${vapiConfigured ? 'bg-jarvis-blue shadow-[0_0_10px_#00f2ff]' : 'bg-jarvis-red shadow-[0_0_10px_#ff3d00]'}`}
          />
          <span className="text-[9px] font-mono tracking-[0.4em] uppercase text-white/50">
            {vapiConfigured ? 'CORE: ONLINE' : 'CORE: RESTRICT'}
          </span>
        </div>
        
        {user && (
          <button 
            onClick={logout}
            className="w-10 h-10 glass-hologram border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors rounded-full"
          >
            <LogOut size={14} className="text-white/20 hover:text-white/40" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-10 pointer-events-auto">
        <div className="text-right">
          <div className="text-2xl font-mono leading-none text-white glow-blue font-light tracking-tighter italic">
            {format(time, 'HH:mm:ss')}
          </div>
          <div className="text-[9px] opacity-20 uppercase tracking-[0.5em] font-mono mt-1">
            {format(time, 'EEE MMM dd yyyy')}
          </div>
        </div>
      </div>
    </header>
  );
};
