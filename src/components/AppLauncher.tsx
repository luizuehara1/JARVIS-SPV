import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Rocket, ExternalLink, X } from 'lucide-react';

interface AppLauncherProps {
  onClose: () => void;
}

interface AppProtocol {
  id: string;
  name: string;
  command: string;
  category: string;
  description: string;
}

const APP_PROTOCOLS: AppProtocol[] = [
  { id: 'spotify', name: 'Spotify', command: 'spotify', category: 'Media', description: 'Neural Audio Streaming' },
  { id: 'chrome', name: 'Chrome', command: 'chrome', category: 'Net', description: 'Quantum Data Navigation' },
  { id: 'vscode', name: 'VSCode', command: 'vscode', category: 'Code', description: 'Structural Logic Engine' },
  { id: 'calculator', name: 'Calculator', command: 'calculadora', category: 'Logic', description: 'Arithmetric Processor' },
  { id: 'explorer', name: 'File Explorer', command: 'explorer', category: 'System', description: 'Local Data Index' },
  { id: 'terminal', name: 'Terminal', command: 'cmd', category: 'Core', description: 'Direct Kernel Interface' },
  { id: 'notepad', name: 'Notepad', command: 'notepad', category: 'Docs', description: 'Buffer Text Entry' },
];

export const AppLauncher: React.FC<AppLauncherProps> = ({ onClose }) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const filteredApps = useMemo(() => {
    return APP_PROTOCOLS.filter(app => 
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleLaunch = (command: string) => {
    if (window.electron) {
      window.electron.executeCommand(command);
    } else {
      console.log(`[SIMULATION] Executing: ${command}`);
    }
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, scale: 1, backdropFilter: 'blur(20px)' }}
      exit={{ opacity: 0, scale: 1.1, backdropFilter: 'blur(0px)' }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6"
    >
      <div className="w-full max-w-4xl glass bg-black/40 border-jarvis-blue/20 rounded-2xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,242,255,0.1)]">
        {/* Search Header */}
        <div className="p-8 border-b border-white/5 flex items-center gap-6">
          <Search className="text-jarvis-blue" size={28} />
          <input 
            autoFocus
            type="text"
            placeholder="ACCESS PROTOCOL..."
            className="flex-1 bg-transparent border-none outline-none font-mono text-2xl tracking-[0.2em] text-white placeholder:text-white/10 uppercase"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Apps Grid */}
        <div className="p-8 grid grid-cols-3 gap-6 overflow-y-auto max-h-[60vh] scrollbar-none">
          <AnimatePresence mode="popLayout">
            {filteredApps.map((app, i) => (
              <motion.button
                key={app.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleLaunch(app.command)}
                className="group relative flex flex-col p-6 bg-white/5 border border-white/5 rounded-xl hover:bg-jarvis-blue/10 hover:border-jarvis-blue/30 transition-all text-left overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Rocket className="text-jarvis-blue" size={16} />
                </div>
                
                <span className="text-[10px] font-mono text-jarvis-blue/60 uppercase tracking-widest mb-1">{app.category}</span>
                <h3 className="text-xl font-bold text-white mb-2">{app.name}</h3>
                <p className="text-[11px] text-white/30 font-mono italic leading-relaxed">{app.description}</p>
                
                <div className="mt-4 flex items-center gap-2 text-[9px] font-mono text-white/20 group-hover:text-jarvis-blue transition-colors">
                  <ExternalLink size={10} />
                  <span>INITIALIZE_SEQUENCE</span>
                </div>

                {/* Decorative particles for hover */}
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-jarvis-blue/10 rounded-full blur-2xl group-hover:bg-jarvis-blue/20 transition-all" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-white/5 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
          <span>Found {filteredApps.length} Protocols</span>
          <span className="animate-pulse">Awaiting Selection...</span>
        </div>
      </div>
    </motion.div>
  );
};
