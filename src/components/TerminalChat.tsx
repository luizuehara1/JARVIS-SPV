import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Message } from '../types';

interface TerminalChatProps {
  history: Message[];
  messages: any[]; // Vapi real-time messages
  isVisible: boolean;
}

export const TerminalChat: React.FC<TerminalChatProps> = ({ history, messages, isVisible }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter Vapi messages to show transcriptions
  const transcriptions = messages.filter(m => m.type === 'transcript');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, transcriptions]);

  if (!isVisible) return null;

  return (
    <div className="h-full flex flex-col font-mono text-[11px] space-y-4 overflow-y-auto scrollbar-none" ref={scrollRef}>
      {/* Historical Messages */}
      <div className="space-y-4 opacity-40">
        {history.slice().reverse().map((msg, i) => (
          <div key={i} className="flex gap-4">
            <span className={`uppercase font-bold tracking-widest ${msg.role === 'assistant' ? 'text-jarvis-blue' : 'text-white/60'}`}>
              [{msg.role === 'assistant' ? 'JARVIS' : 'USER'}]:
            </span>
            <span className="text-white/80 leading-relaxed italic">{msg.content}</span>
          </div>
        ))}
      </div>

      {/* Real-time Transcription Stream */}
      <div className="space-y-4">
        {transcriptions.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            <span className={`uppercase font-bold tracking-widest ${t.role === 'assistant' ? 'text-jarvis-blue glow-blue' : 'text-white/60'}`}>
              [{t.role === 'assistant' ? 'JARVIS' : 'USER'}]:
            </span>
            <span className={`leading-relaxed ${t.transcriptType === 'partial' ? 'text-white/40' : 'text-white'}`}>
              {t.transcript}
              {t.transcriptType === 'partial' && <span className="animate-pulse">_</span>}
            </span>
          </motion.div>
        ))}
      </div>
      
      {/* Scroll anchor */}
      <div className="h-4 shrink-0" />
    </div>
  );
};
