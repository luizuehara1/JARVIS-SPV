import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React from 'react';

interface VoiceInterfaceProps {
  isConnecting: boolean;
  isActive: boolean;
  volumeLevel: number;
  onToggle: () => void;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
  isConnecting, 
  isActive, 
  volumeLevel,
  onToggle 
}) => {
  return (
    <div className="flex flex-col items-center justify-center relative z-30 pointer-events-none">
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          pointer-events-auto
          relative w-20 h-20 rounded-full flex items-center justify-center 
          transition-all duration-700 backdrop-blur-2xl border
          ${isActive 
            ? 'bg-jarvis-blue/10 border-jarvis-blue shadow-[0_0_40px_rgba(0,242,255,0.2)]' 
            : 'bg-black/20 border-white/5 hover:border-jarvis-blue/20 hover:bg-jarvis-blue/5'
          }
          ${isConnecting ? 'animate-pulse' : ''}
        `}
      >
        <div className="relative">
          {isActive ? (
            <Mic size={24} className="text-jarvis-blue glow-blue" />
          ) : (
            <MicOff size={24} className="text-white/20 group-hover:text-white/40 transition-colors" />
          )}
          
          {/* Reactive Ring */}
          {isActive && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 -m-8 border border-jarvis-blue/20 rounded-full"
            />
          )}
        </div>
      </motion.button>
    </div>
  );
};
