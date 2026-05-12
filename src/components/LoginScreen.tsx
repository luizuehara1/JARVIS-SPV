import React from 'react';
import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

export const LoginScreen: React.FC = () => {
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center font-sans">
      {/* Cinematic Background Particles (CSS/Tailwind based for login) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-[1px] bg-jarvis-blue rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              opacity: Math.random()
            }}
            animate={{ 
              y: [null, '-=100px'],
              opacity: [0, 0.4, 0]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Holographic Grid */}
      <div className="absolute inset-0 pointer-events-none hologram-grid opacity-30" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <div className="mb-8 relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 border border-jarvis-blue/20 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-12 border border-white/5 rounded-full"
          />
          
          <h1 className="text-6xl font-black tracking-[0.4em] uppercase text-white glow-blue">
            JARVIS <span className="text-jarvis-blue/60 font-light italic">SPV</span>
          </h1>
          <p className="mt-4 text-[10px] font-mono tracking-[0.6em] uppercase text-white/40">
            Strategic Personal Visionary
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={async () => {
            try {
              await signInWithGoogle();
            } catch (err) {
              console.error("Login failed", err);
            }
          }}
          className="group relative flex items-center gap-4 px-10 py-4 bg-white/5 border border-white/10 rounded-full backdrop-blur-3xl hover:bg-jarvis-blue/10 hover:border-jarvis-blue/40 transition-all duration-500 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <LogIn className="w-5 h-5 text-jarvis-blue" />
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-white group-hover:text-jarvis-blue transition-colors">
            Authorize Neural Link
          </span>
        </motion.button>


        <div className="mt-12 flex gap-6">
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-mono text-white/20 uppercase">Core Status</span>
            <span className="text-[9px] font-mono text-jarvis-blue/60 uppercase">Stable</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-mono text-white/20 uppercase">Version</span>
            <span className="text-[9px] font-mono text-jarvis-blue/60 uppercase">X.ALPHA.01</span>
          </div>
        </div>
      </motion.div>

      {/* Decorative Ornaments */}
      <div className="absolute top-10 left-10 w-24 h-24 border-t border-l border-white/10" />
      <div className="absolute top-10 right-10 w-24 h-24 border-t border-r border-white/10" />
      <div className="absolute bottom-10 left-10 w-24 h-24 border-b border-l border-white/10" />
      <div className="absolute bottom-10 right-10 w-24 h-24 border-b border-r border-white/10" />
    </div>
  );
};
