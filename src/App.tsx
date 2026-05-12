import { Activity, Brain, Shield, User as UserIcon, Search, LayoutGrid } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, orderBy, limit, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { DiagnosticOverlay } from './components/DiagnosticOverlay.tsx';
import { HUDLayout } from './components/HUDLayout.tsx';
import { MemoryPanel } from './components/MemoryPanel.tsx';
import { NeuralCore } from './components/NeuralCore.tsx';
import { StatusBars } from './components/StatusBars.tsx';
import { TerminalChat } from './components/TerminalChat.tsx';
import { VoiceInterface } from './components/VoiceInterface.tsx';
import { AppLauncher } from './components/AppLauncher.tsx';
import { useVapi } from './hooks/useVapi.ts';
import { auth, db, signInWithGoogle, OperationType, handleFirestoreError } from './lib/firebase.ts';
import { Message, UserPreferences } from './types.ts';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<Message[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showMemory, setShowMemory] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showLauncher, setShowLauncher] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { 
    startCall, 
    stopCall, 
    isConnecting, 
    activeCall, 
    volumeLevel, 
    transcript,
    isConfigured,
    errorStatus
  } = useVapi();

  // Auth Listener
  useEffect(() => {
    console.log('[JARVIS] Protocol Initialization...');
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        console.log(`[JARVIS] Authorized Personnel: ${u.displayName}`);
        initializeUserData(u.uid);
      } else {
        setIsInitializing(false);
      }
    });
    return unsub;
  }, []);

  const initializeUserData = async (uid: string) => {
    const prefRef = doc(db, 'users', uid, 'preferences', 'main');
    onSnapshot(prefRef, (snap) => {
      if (snap.exists()) {
        setPreferences(snap.data() as UserPreferences);
      } else {
        setDoc(prefRef, { userId: uid, name: auth.currentUser?.displayName })
          .catch(err => handleFirestoreError(err, OperationType.WRITE, 'users/preferences'));
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'users/preferences'));

    const historyRef = collection(db, 'users', uid, 'history');
    const q = query(historyRef, orderBy('timestamp', 'desc'), limit(15));
    onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Message));
      setHistory(msgs);
      setIsInitializing(false);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'users/history'));
  };

  const handleVoiceToggle = () => {
    if (activeCall) {
      stopCall();
    } else {
      startCall();
    }
  };

  if (!user && !isInitializing) {
    return (
      <HUDLayout>
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 h-screen">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <h1 className="text-6xl font-black tracking-[0.2em] italic text-jarvis-blue glow-blue">
              JARVIS <span className="text-white font-light">SPV</span>
            </h1>
            <p className="text-jarvis-blue/40 font-mono tracking-[0.5em] uppercase text-[10px]">
              Strategic Personal Visionary
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={signInWithGoogle}
            className="px-10 py-4 bg-jarvis-blue/5 border border-jarvis-blue/30 text-jarvis-blue rounded-full font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-jarvis-blue hover:text-jarvis-dark transition-all duration-500 border-glow-blue shadow-2xl backdrop-blur-xl"
          >
            Execute Core Protocol
          </motion.button>
        </div>
      </HUDLayout>
    );
  }

  return (
    <HUDLayout>
      <StatusBars />
      
      <DiagnosticOverlay />

      <main className="flex-1 relative min-h-0 overflow-hidden flex flex-col items-center justify-center">
        {/* Main 3D Core - Always Center */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
            <NeuralCore active={!!activeCall} volume={volumeLevel} isThinking={isConnecting} />
          </Canvas>
        </div>

        {/* Cinematic Backdrop Overlays */}
        <div className="absolute inset-0 pointer-events-none hologram-grid opacity-30" />
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-transparent to-black" />

        {/* Global HUD Elements */}
        {!isInitializing && (
          <>
            {/* Minimal Side Toggles (Lateral Edges) */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col space-y-4 z-50">
              <HUDToggleButton 
                active={showLauncher} 
                onClick={() => setShowLauncher(!showLauncher)} 
                icon={<LayoutGrid size={16} />} 
                label="APPS" 
              />
              <HUDToggleButton 
                active={showMemory} 
                onClick={() => setShowMemory(!showMemory)} 
                icon={<Brain size={16} />} 
                label="MEM" 
              />
              <HUDToggleButton 
                active={showStats} 
                onClick={() => setShowStats(!showStats)} 
                icon={<Activity size={16} />} 
                label="DIAG" 
              />
            </div>

            {/* Expandable Holographic Chat (Bottom Center) */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-40">
              <motion.div
                animate={{ height: showChat ? '400px' : '40px' }}
                className="glass-hologram overflow-hidden flex flex-col pointer-events-auto"
              >
                <button 
                  onClick={() => setShowChat(!showChat)}
                  className="h-10 flex items-center justify-between px-4 border-b border-white/5 hover:bg-white/5 transition-colors shrink-0"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-1.5 h-1.5 bg-jarvis-blue rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono tracking-[0.2em] text-jarvis-blue/60 uppercase italic">
                      Neural Interface Protocol: Active
                    </span>
                  </div>
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
                    {showChat ? '[ COLLAPSE ]' : '[ INITIALIZE STREAM ]'}
                  </span>
                </button>
                
                <div className="flex-1 overflow-hidden p-4 mask-fade-top">
                  <TerminalChat 
                    messages={transcript ? [{ role: 'assistant', content: transcript, id: 'temp' }, ...history] : history} 
                    isExpanded={showChat}
                  />
                </div>
              </motion.div>
            </div>

            {/* Floating Modules Overlays */}
            <AnimatePresence>
              {showMemory && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
                  onClick={() => setShowMemory(false)}
                >
                  <div className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                    <MemoryPanel history={history} preferences={preferences} />
                  </div>
                </motion.div>
              )}

              {showStats && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute right-24 top-1/2 -translate-y-1/2 w-72 z-50 glass-hologram p-6"
                >
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] mb-6 text-jarvis-blue glow-blue">Neural Diagnostics</h2>
                  <div className="space-y-6 font-mono">
                    <DiagnosticStat label="Memory Core" value="Synchronized" />
                    <DiagnosticStat label="Pulse Rate" value="1.2ms" />
                    <DiagnosticStat label="Integrity" value="99.9%" />
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between items-end">
                        <span className="text-[9px] text-white/30 uppercase tracking-widest">Core Activity</span>
                      </div>
                      <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: ['40%', '80%', '60%', '95%', '70%'] }}
                          transition={{ duration: 5, repeat: Infinity }}
                          className="h-full bg-jarvis-blue shadow-[0_0_10px_#00f2ff]" 
                         />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* App Launcher Overlay */}
            <AnimatePresence>
              {showLauncher && (
                <AppLauncher onClose={() => setShowLauncher(false)} />
              )}
            </AnimatePresence>
          </>
        )}

        <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
          {isInitializing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center space-y-6"
            >
              <div className="relative">
                <div className="w-16 h-16 border border-jarvis-blue/20 rounded-full animate-ping absolute inset-0" />
                <div className="w-16 h-16 border-2 border-jarvis-blue border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(0,242,255,0.4)]" />
              </div>
              <div className="flex flex-col items-center space-y-1">
                <span className="text-[11px] font-mono text-jarvis-blue uppercase tracking-[0.8em] animate-pulse glow-blue">
                  Synchronizing Neural Core
                </span>
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.4em]">
                  Initializing Protocol JARVIS-X.1
                </span>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Voice Interface Focus */}
              <VoiceInterface 
                isConnecting={isConnecting}
                isActive={!!activeCall}
                volumeLevel={volumeLevel}
                onToggle={handleVoiceToggle}
                isConfigured={isConfigured}
                errorStatus={errorStatus}
              />
            </>
          )}
        </div>

        {/* Access Shortcuts - Minimal Pill */}
        {!isInitializing && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 right-6 flex gap-3 z-40 pointer-events-auto"
          >
            <button 
              onClick={() => setShowLauncher(true)}
              className="w-10 h-10 glass-hologram flex items-center justify-center text-jarvis-blue/40 hover:text-jarvis-blue hover:border-jarvis-blue/40 transition-all rounded-full"
            >
              <Search size={14} />
            </button>
          </motion.div>
        )}
      </main>

      {/* Footer Bar */}
      <footer className="h-10 px-8 flex items-center justify-between border-t border-white/5 bg-black/80 backdrop-blur-md">
        <div className="flex gap-6">
          <span className="text-[9px] opacity-30 uppercase tracking-[0.2em] font-mono">Secure Node: AWS-SA-E1</span>
          <span className="text-[9px] opacity-30 uppercase tracking-[0.2em] font-mono">OS: JARVIS-X.1</span>
        </div>
        <div className="flex gap-8 items-center font-mono">
          <div className="flex gap-2 items-center">
            <div className="w-1 h-1 bg-jarvis-blue rounded-full" />
            <span className="text-[9px] opacity-50">SYNC: 1.2ms</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-1 h-1 bg-jarvis-blue rounded-full" />
            <span className="text-[9px] opacity-50">TEMP: 32°C</span>
          </div>
          <span className="text-[9px] opacity-30 uppercase tracking-widest">© 2026 STARK INDUSTRIES SPV</span>
        </div>
      </footer>
    </HUDLayout>
  );
};

const HUDToggleButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <motion.button
    whileHover={{ scale: 1.1, x: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`w-10 h-10 flex flex-col items-center justify-center rounded-lg border transition-all duration-500 ${
      active 
        ? 'bg-jarvis-blue/20 text-jarvis-blue border-jarvis-blue/60 shadow-[0_0_20px_rgba(0,242,255,0.2)]' 
        : 'bg-black/40 text-white/20 border-white/5 hover:border-white/20 hover:text-white/40'
    }`}
  >
    <div className={active ? 'glow-blue' : ''}>{icon}</div>
    <span className="text-[6px] mt-0.5 font-mono font-bold tracking-widest uppercase">{label}</span>
  </motion.button>
);

const DiagnosticStat = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center border-b border-white/5 py-2">
    <span className="text-[8px] text-white/20 uppercase tracking-[0.2em]">{label}</span>
    <span className="text-[10px] text-jarvis-blue/80 glow-blue">{value}</span>
  </div>
);
