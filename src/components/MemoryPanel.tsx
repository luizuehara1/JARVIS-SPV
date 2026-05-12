import { Brain, History, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

interface MemoryPanelProps {
  history: any[];
  preferences: any;
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({ history, preferences }) => {
  return (
    <aside className="w-full h-full flex flex-col gap-6 overflow-hidden relative font-sans">
      <div className="flex-1 glass-hologram p-8 relative overflow-hidden flex flex-col min-h-0">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.5em] mb-8 flex items-center justify-between text-jarvis-blue glow-blue">
          NEURAL_STORAGE
          <span className="text-white/20 text-[8px] font-mono tracking-widest">[S_LINK: OK]</span>
        </h2>
        
        <div className="space-y-6 overflow-y-auto pr-2 scrollbar-none flex-1">
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
            <p className="text-[8px] text-jarvis-blue/40 uppercase mb-2 font-mono tracking-[0.2em]">Authorized Personnel</p>
            <p className="text-sm text-white/80 font-light tracking-wide">{preferences?.name || 'LUIZ UEHARA'}</p>
          </div>

          <div className="space-y-4 pt-6 flex flex-col min-h-0">
            <h3 className="text-[9px] uppercase tracking-[0.4em] text-white/30 flex items-center gap-2">
              <History size={12} className="text-jarvis-blue/40" /> LOG_ARCHIVE
            </h3>
            <div className="space-y-3 overflow-y-auto">
              {history.length === 0 ? (
                <div className="text-[8px] text-white/10 uppercase tracking-widest italic">No records found.</div>
              ) : (
                history.map((msg, i) => (
                  <div key={i} className="text-[10px] flex flex-col gap-1 border-l border-white/5 pl-3 py-1">
                    <span className="text-jarvis-blue/40 font-mono text-[8px]">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-white/40 truncate italic">// {msg.content}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
