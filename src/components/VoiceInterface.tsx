import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInterfaceProps {
  isActive: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  onToggle: () => void;
  error: string | null;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
  isActive, 
  isConnecting, 
  isSpeaking, 
  onToggle,
  error 
}) => {
  return (
    <div className="flex flex-col items-center justify-center relative pointer-events-none">
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          pointer-events-auto
          relative w-32 h-32 rounded-full flex items-center justify-center 
          transition-all duration-1000 border backdrop-blur-3xl
          ${isActive 
            ? 'bg-jarvis-blue/10 border-jarvis-blue/50 shadow-[0_0_50px_rgba(0,242,255,0.2)]' 
            : error 
              ? 'bg-jarvis-red/5 border-jarvis-red/30' 
              : 'bg-black/40 border-white/5 hover:border-jarvis-blue/20'
          }
        `}
      >
        <div className="relative z-10">
          {isConnecting ? (
            <Loader2 size={32} className="text-jarvis-blue animate-spin" />
          ) : isActive ? (
            <Mic size={32} className={`text-jarvis-blue ${isSpeaking ? 'animate-pulse scale-125' : ''} transition-all duration-300 glow-blue`} />
          ) : (
            <MicOff size={32} className={`${error ? 'text-jarvis-red/60' : 'text-white/20'}`} />
          )}
        </div>

        {/* Pulsing Aura when active */}
        {isActive && (
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-jarvis-blue/20 rounded-full"
          />
        )}

        {/* Outer Orbit Rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 border border-jarvis-blue/10 rounded-full border-t-jarvis-blue/40"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-8 border border-white/5 rounded-full border-b-white/20"
        />
      </motion.button>

      {/* State Labels */}
      <div className="absolute top-40 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-[10px] font-mono text-jarvis-red uppercase tracking-[0.4em] glow-red"
            >
              {error === 'MIC_PERMISSION_DENIED' ? 'PERMISSION ERROR' : 'LINK FAILURE'}
            </motion.span>
          ) : isConnecting ? (
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-[10px] font-mono text-jarvis-blue uppercase tracking-[0.4em] animate-pulse"
            >
              Establishing Neural Link
            </motion.span>
          ) : isActive ? (
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-[10px] font-mono text-jarvis-blue uppercase tracking-[0.4em] glow-blue"
            >
              {isSpeaking ? 'Transmitting' : 'Link Stable'}
            </motion.span>
          ) : (
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]"
            >
              Standby
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
