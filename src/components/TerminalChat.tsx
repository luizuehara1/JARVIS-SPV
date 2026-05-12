import { motion, AnimatePresence } from 'motion/react';
import React, { useEffect, useState } from 'react';

interface TerminalChatProps {
  messages: any[];
  isExpanded?: boolean;
}

const TypewriterText = ({ text, delay = 15 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

export const TerminalChat: React.FC<TerminalChatProps> = ({ messages, isExpanded }) => {
  const displayMessages = messages.slice(0, isExpanded ? 20 : 1).reverse();

  return (
    <div className="flex flex-col h-full pointer-events-auto">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-none scroll-smooth mask-fade-top pt-4">
        <AnimatePresence mode="popLayout">
          {displayMessages.map((msg, i) => (
            <motion.div
              key={msg.id || i}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`
                p-4 border-l font-mono text-[11px] leading-relaxed relative rounded-r-lg group
                ${msg.role === 'assistant' 
                  ? 'border-jarvis-blue/40 bg-jarvis-blue/[0.03] text-white/90 shadow-[inset_0_0_15px_rgba(0,242,255,0.02)]' 
                  : 'border-white/10 bg-white/[0.02] text-white/50'
                }
              `}
            >
              <div className="text-[8px] uppercase tracking-[0.2em] opacity-30 mb-2 flex justify-between">
                <span className="flex items-center gap-2">
                  {msg.role === 'assistant' ? (
                    <div className="w-1 h-1 bg-jarvis-blue rounded-full animate-pulse" />
                  ) : (
                    <div className="w-1 h-1 bg-white/40 rounded-full" />
                  )}
                  {msg.role === 'assistant' ? 'JARVIS_NEURAL_OUT' : 'USER_AUTHORIZED_INPUT'}
                </span>
                <span className="group-hover:opacity-100 transition-opacity">
                  {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <div className="drop-shadow-[0_0_5px_rgba(0,242,255,0.1)]">
                {msg.role === 'assistant' && msg.id === 'temp' ? (
                  <TypewriterText text={msg.content} />
                ) : (
                  <span className={msg.role === 'assistant' ? 'text-jarvis-blue/90' : ''}>
                    {msg.content}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
