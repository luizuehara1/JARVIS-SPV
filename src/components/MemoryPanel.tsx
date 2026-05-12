import React from 'react';
import { motion } from 'motion/react';
import { Database, User, Brain, History } from 'lucide-react';
import { Message } from '../types';

interface MemoryPanelProps {
  preferences: { name: string; context: string };
  history: Message[];
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({ preferences, history }) => {
  return (
    <div className="glass-hologram border border-jarvis-blue/20 rounded-2xl overflow-hidden backdrop-blur-3xl p-10 flex flex-col max-h-[80vh] font-sans">
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-jarvis-blue/10 rounded-lg flex items-center justify-center border border-jarvis-blue/30 glow-blue">
            <Database size={20} className="text-jarvis-blue" />
          </div>
          <div>
            <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-white">Neural_Storage</h2>
            <p className="text-[8px] font-mono text-jarvis-blue/60 uppercase tracking-widest mt-1">Status: Fully Synchronized</p>
          </div>
        </div>
        <span className="text-[9px] font-mono text-white/10 uppercase tracking-tight">Sync_V: 1.0.4</span>
      </header>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <section className="bg-white/[0.02] border border-white/5 p-6 rounded-xl relative group">
          <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <User size={16} />
          </div>
          <h3 className="text-[9px] font-mono text-jarvis-blue/40 uppercase tracking-widest mb-4">Identity_Profile</h3>
          <p className="text-lg font-light tracking-wide text-white">{preferences.name}</p>
          <div className="mt-4 flex gap-2">
            <div className="px-2 py-0.5 bg-jarvis-blue/10 border border-jarvis-blue/20 rounded text-[7px] text-jarvis-blue uppercase">Authorized</div>
            <div className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[7px] text-white/40 uppercase">Root_Access</div>
          </div>
        </section>

        <section className="bg-white/[0.02] border border-white/5 p-6 rounded-xl relative group">
          <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <Brain size={16} />
          </div>
          <h3 className="text-[9px] font-mono text-jarvis-blue/40 uppercase tracking-widest mb-4">Core_Context</h3>
          <p className="text-[11px] leading-relaxed text-white/70 italic line-clamp-3">
            "{preferences.context || 'Strategic and neural context parameters initializing...'}"
          </p>
        </section>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="flex items-center gap-3 mb-6">
          <History size={14} className="text-white/20" />
          <h3 className="text-[9px] font-mono text-white/30 uppercase tracking-[0.4em]">Temporal_Archive</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-4 space-y-4 scrollbar-none">
          {history.length === 0 ? (
            <div className="text-[10px] text-white/10 uppercase tracking-widest text-center py-10 italic">No records found in current node.</div>
          ) : (
            history.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-1 border-l border-white/5 pl-4 py-1"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] font-mono text-jarvis-blue/40 uppercase">{msg.role === 'assistant' ? 'Assistant' : 'User'}</span>
                  <span className="text-[8px] font-mono text-white/10">{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-white/60 font-light leading-relaxed truncate">{msg.content}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <footer className="mt-10 pt-6 border-t border-white/5 flex justify-end">
        <button className="text-[9px] font-mono text-white/20 uppercase tracking-[0.5em] hover:text-jarvis-blue transition-colors">
          [ Request Archival Export ]
        </button>
      </footer>
    </div>
  );
};
