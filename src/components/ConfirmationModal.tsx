import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ShieldCheck, XCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md glass-hologram border border-jarvis-blue/30 p-10 rounded-2xl flex flex-col items-center text-center shadow-[0_0_100px_rgba(0,242,255,0.1)]"
          >
            <div className="w-16 h-16 bg-jarvis-blue/10 border border-jarvis-blue/40 rounded-full flex items-center justify-center mb-6 glow-blue">
              <ShieldCheck className="text-jarvis-blue" size={32} />
            </div>
            
            <h2 className="text-[14px] font-black uppercase tracking-[0.4em] text-white mb-4">Authorization Required</h2>
            
            <p className="text-[12px] font-light leading-relaxed text-white/70 mb-10 italic">
              "Senhor, esse comando pode alterar arquivos do computador. Deseja confirmar?"
              <br />
              <span className="text-jarvis-blue/40 mt-2 block">Action: {message}</span>
            </p>

            <div className="flex gap-4 w-full">
              <button
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-white/5 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
              >
                <XCircle size={16} className="text-white/20 group-hover:text-white/60" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60">Cancel</span>
              </button>
              
              <button
                onClick={onConfirm}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-jarvis-blue/40 bg-jarvis-blue/10 rounded-xl hover:bg-jarvis-blue/20 transition-all group"
              >
                <ShieldCheck size={16} className="text-jarvis-blue" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-jarvis-blue group-hover:glow-blue">Confirm</span>
              </button>
            </div>
            
            <div className="mt-8 flex items-center gap-2 opacity-20">
              <AlertTriangle size={10} />
              <span className="text-[7px] font-mono uppercase tracking-widest">Protocol: Neural-Lock Security Tier 2</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
