import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, orderBy, limit, onSnapshot, doc, setDoc, addDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, LayoutGrid, Activity, Search } from 'lucide-react';

import { auth, db, OperationType, handleFirestoreError } from './lib/firebase.ts';
import { useVapi } from './hooks/useVapi.ts';
import { Message, UserPreferences } from './types.ts';

import { LoginScreen } from './components/LoginScreen.tsx';
import { HUDLayout } from './components/HUDLayout.tsx';
import { StatusBars } from './components/StatusBars.tsx';
import { DiagnosticOverlay } from './components/DiagnosticOverlay.tsx';
import { NeuralCore3D } from './components/NeuralCore3D.tsx';
import { VoiceInterface } from './components/VoiceInterface.tsx';
import { TerminalChat } from './components/TerminalChat.tsx';
import { MemoryPanel } from './components/MemoryPanel.tsx';
import { AppLauncher } from './components/AppLauncher.tsx';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<Message[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // HUD States
  const [showMemory, setShowMemory] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showLauncher, setShowLauncher] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const { 
    start, 
    stop, 
    isConnected, 
    isConnecting, 
    isSpeaking, 
    error, 
    messages, 
    isConfigured 
  } = useVapi();

  // Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        initializeUserData(u.uid);
      } else {
        setIsInitializing(false);
      }
    });
    return unsub;
  }, []);

  const initializeUserData = async (uid: string) => {
    // Preferences
    const prefRef = doc(db, 'users', uid, 'preferences', 'main');
    onSnapshot(prefRef, (snap) => {
      if (snap.exists()) {
        setPreferences(snap.data() as UserPreferences);
      } else {
        setDoc(prefRef, { 
          userId: uid, 
          name: auth.currentUser?.displayName,
          context: "Marketing, Tráfego Pago, Criação de Sites, Automações"
        }).catch(err => handleFirestoreError(err, OperationType.WRITE, 'users/preferences'));
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'users/preferences'));

    // History
    const historyRef = collection(db, 'users', uid, 'history');
    const q = query(historyRef, orderBy('timestamp', 'desc'), limit(20));
    onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Message));
      setHistory(msgs);
      setIsInitializing(false);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'users/history'));
  };

  // Sync Vapi messages to Firestore
  useEffect(() => {
    if (messages.length > 0 && user) {
      const lastMsg = messages[messages.length - 1];
      // Only sync transcription messages if they are final
      if (lastMsg.type === 'transcript' && lastMsg.transcriptType === 'final') {
        const content = lastMsg.transcript;
        const role = lastMsg.role === 'assistant' ? 'assistant' : 'user';
        
        addDoc(collection(db, 'users', user.uid, 'history'), {
          content,
          role,
          timestamp: Date.now()
        }).catch(err => handleFirestoreError(err, OperationType.WRITE, 'users/history'));
      }
    }
  }, [messages, user]);

  const handleVoiceToggle = () => {
    if (isConnected) stop();
    else start();
  };

  if (!user && !isInitializing) {
    return <LoginScreen />;
  }

  if (isInitializing) {
    return (
      <HUDLayout>
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-2 border-jarvis-blue border-t-transparent rounded-full shadow-[0_0_30px_rgba(0,242,255,0.3)]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-jarvis-blue/10 rounded-full animate-pulse" />
            </div>
          </div>
          <span className="text-[10px] font-mono text-jarvis-blue uppercase tracking-[0.8em] glow-blue">
            Initializing Neural Core
          </span>
        </div>
      </HUDLayout>
    );
  }

  return (
    <HUDLayout>
      <StatusBars />
      
      <DiagnosticOverlay />

      <main className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
        {/* Cinematic Neural Core 3D */}
        <div className="absolute inset-0 z-0">
          <NeuralCore3D 
            isConnected={isConnected} 
            isSpeaking={isSpeaking} 
            isConnecting={isConnecting}
            error={error}
          />
        </div>

        {/* HUD Elements Overlay */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          
          {/* Side Toggles */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col space-y-6">
            <HUDButton active={showLauncher} onClick={() => setShowLauncher(!showLauncher)} icon={<LayoutGrid size={18} />} label="APPS" />
            <HUDButton active={showMemory} onClick={() => setShowMemory(!showMemory)} icon={<Brain size={18} />} label="MEM" />
            <HUDButton active={showStats} onClick={() => setShowStats(!showStats)} icon={<Activity size={18} />} label="DIAG" />
          </div>

          {/* Voice Interface Control */}
          <VoiceInterface 
            isActive={isConnected}
            isConnecting={isConnecting}
            isSpeaking={isSpeaking}
            onToggle={handleVoiceToggle}
            error={error}
          />

          {/* Chat Interface (Bottom) */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-3xl px-8">
            <motion.div
              animate={{ height: showChat ? '300px' : '48px' }}
              className="glass-hologram border border-white/5 rounded-xl overflow-hidden flex flex-col backdrop-blur-2xl"
            >
              <button 
                onClick={() => setShowChat(!showChat)}
                className="h-12 flex items-center justify-between px-6 border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <div className="flex gap-4 items-center">
                  <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-jarvis-blue animate-pulse glow-blue' : 'bg-white/10'}`} />
                  <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">
                    Neural Stream: {isConnected ? 'Active' : 'Standby'}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  {showChat ? '[ COLLAPSE ]' : '[ INITIALIZE ]'}
                </span>
              </button>
              
              <div className="flex-1 p-6 overflow-hidden">
                <TerminalChat history={history} messages={messages} isVisible={showChat} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Modal Panels */}
        <AnimatePresence>
          {showMemory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6"
              onClick={() => setShowMemory(false)}
            >
              <div className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <MemoryPanel preferences={preferences || { name: user?.displayName || 'Unknown', context: '' }} history={history} />
              </div>
            </motion.div>
          )}

          {showStats && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-28 top-1/2 -translate-y-1/2 w-80 glass-hologram p-8 z-[100] border border-jarvis-blue/20"
            >
              <h2 className="text-[12px] font-bold uppercase tracking-[0.4em] mb-8 text-jarvis-blue glow-blue">Neural Diagnostics</h2>
              <div className="space-y-6">
                <DiagRow label="Vapi Status" value={isConnected ? 'CONNECTED' : isConnecting ? 'SYNCING' : 'STANDBY'} highlight={isConnected} />
                <DiagRow label="Neural Link" value={isSpeaking ? 'TRANSMITTING' : 'LISTENING'} highlight={isSpeaking} />
                <DiagRow label="Access Node" value="JARVIS-X.01" />
                <DiagRow label="Assistant ID" value={import.meta.env.VITE_VAPI_ASSISTANT_ID?.slice(0, 8) + '...'} />
                <DiagRow label="Public Key" value={import.meta.env.VITE_VAPI_PUBLIC_KEY?.slice(0, 8) + '...'} />
                {error && <DiagRow label="System Error" value={error} error />}
              </div>
            </motion.div>
          )}

          {showLauncher && <AppLauncher onClose={() => setShowLauncher(false)} />}
        </AnimatePresence>
      </main>

      <footer className="h-12 px-10 flex items-center justify-between border-t border-white/5 bg-black/40 backdrop-blur-xl z-20">
        <div className="flex gap-8">
          <span className="text-[8px] opacity-20 uppercase font-mono tracking-widest italic">Core Protocol: Neural Link</span>
          <span className="text-[8px] opacity-20 uppercase font-mono tracking-widest italic">Node: {Math.random().toString(36).slice(2, 8).toUpperCase()}</span>
        </div>
        <div className="flex gap-10 items-center font-mono opacity-40">
          <div className="flex gap-2 items-center">
            <div className="w-1 h-1 bg-jarvis-blue rounded-full" />
            <span className="text-[9px]">L_SYNC: 0.8ms</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-1 h-1 bg-jarvis-blue rounded-full" />
            <span className="text-[9px]">TEMP: 28°C</span>
          </div>
          <span className="text-[9px] tracking-[0.2em] uppercase">© 2026 STARK INDUSTRIES</span>
        </div>
      </footer>
    </HUDLayout>
  );
}

const HUDButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <motion.button
    whileHover={{ scale: 1.1, x: -5 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`w-12 h-12 flex flex-col items-center justify-center rounded-xl border transition-all duration-300 ${
      active 
        ? 'bg-jarvis-blue/20 border-jarvis-blue/50 text-jarvis-blue shadow-[0_0_25px_rgba(0,242,255,0.2)]' 
        : 'bg-black/40 border-white/5 text-white/20 hover:border-white/20 hover:text-white/40'
    }`}
  >
    {icon}
    <span className="text-[7px] mt-1 font-mono font-bold tracking-widest">{label}</span>
  </motion.button>
);

const DiagRow = ({ label, value, highlight, error }: { label: string; value: string; highlight?: boolean; error?: boolean }) => (
  <div className="flex justify-between items-center py-2 border-b border-white/5">
    <span className="text-[8px] text-white/20 uppercase tracking-widest font-mono">{label}</span>
    <span className={`text-[10px] font-mono tracking-tighter ${error ? 'text-jarvis-red' : highlight ? 'text-jarvis-blue glow-blue' : 'text-white/60'}`}>
      {value}
    </span>
  </div>
);
