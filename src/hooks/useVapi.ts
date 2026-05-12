import Vapi from '@vapi-ai/web';
import { useEffect, useRef, useState } from 'react';

const vapiPublicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const vapiAssistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

export const useVapi = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeCall, setActiveCall] = useState<any>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  const vapiRef = useRef<Vapi | null>(null);

  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    if (vapiPublicKey && vapiPublicKey !== 'YOUR_VAPI_PUBLIC_KEY') {
      console.log('[JARVIS] Initializing Vapi SDK...');
      vapiRef.current = new Vapi(vapiPublicKey);

      vapiRef.current.on('call-start', () => {
        console.log('[JARVIS] System Link Established.');
        setIsConnecting(false);
        setActiveCall(true);
      });

      vapiRef.current.on('call-end', () => {
        console.log('[JARVIS] System Link Terminated.');
        setActiveCall(null);
        setIsConnecting(false);
        setVolumeLevel(0);
        setTranscript('');
      });

      vapiRef.current.on('volume-level', (level) => {
        setVolumeLevel(level);
      });

      vapiRef.current.on('message', (message) => {
        if (message.type === 'transcript' && message.transcriptType === 'partial') {
          const text = message.transcript.toLowerCase();
          setTranscript(message.transcript);
          
          // Command Detection Logic
          if (text.includes('abra') || text.includes('open') || text.includes('execute')) {
            const apps = ['spotify', 'chrome', 'vscode', 'code', 'calculadora', 'explorer', 'navegador'];
            const targetApp = apps.find(app => text.includes(app));
            
            if (targetApp) {
              console.log(`[JARVIS] Command Intent Detected: ${targetApp}`);
              if (window.electron) {
                window.electron.executeCommand(targetApp).then(res => {
                  if (res.success) {
                    console.log(`[JARVIS] ${targetApp} opened successfully.`);
                  } else {
                    console.error(`[JARVIS] Failed to open ${targetApp}: ${res.error}`);
                  }
                });
              } else {
                console.warn(`[JARVIS] Protocol Simulation: Opening ${targetApp} (Feature requires local Electron run).`);
              }
            }
          }
        }
      });

      vapiRef.current.on('error', (e) => {
        const errorMessage = typeof e === 'string' ? e : (e as any)?.message || JSON.stringify(e);
        
        // Gracefully handle common ejection/termination errors
        if (errorMessage.includes('Meeting ended due to ejection') || errorMessage.includes('Meeting has ended') || errorMessage.includes('connection-closed')) {
          console.warn('[JARVIS] System Link Termination:', errorMessage);
          setIsConnecting(false);
          setActiveCall(null);
          setVolumeLevel(0);
          return;
        }

        console.error('[JARVIS] Neural Link Critical Error:', e);
        setIsConnecting(false);
        setActiveCall(null);
        setVolumeLevel(0);
        
        if (errorMessage.includes('assistantId') || errorMessage.includes('Assistant not found')) {
          console.error('[JARVIS] INVALID_ASSISTANT_ID: Please check your Vapi Dashboard.');
          setErrorStatus('Invalid Assistant ID');
        } else {
          setErrorStatus('Connection Error');
        }
      });

      vapiRef.current.on('speech-start', () => {
        console.log('[JARVIS] Jarvis is speaking...');
      });

      vapiRef.current.on('speech-end', () => {
        console.log('[JARVIS] Jarvis finished speaking.');
      });
    } else {
      console.warn('[JARVIS] VAPI_PUBLIC_KEY is missing or default. Voice interaction disabled.');
    }

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const startCall = async () => {
    if (!vapiRef.current) {
      console.error('[JARVIS] Vapi not initialized.');
      return;
    }
    
    console.log('[JARVIS] Initiating Neural Link Sequence...');
    setIsConnecting(true);
    
    try {
      // If we have an assistant ID, prioritize it. Otherwise use the transient config.
      if (vapiAssistantId && vapiAssistantId !== 'YOUR_VAPI_ASSISTANT_ID') {
        console.log(`[JARVIS] Connecting to Assistant: ${vapiAssistantId}`);
        await vapiRef.current.start(vapiAssistantId);
      } else {
        console.log('[JARVIS] Starting with local configuration...');
        await vapiRef.current.start({
          name: "JARVIS-SPV",
          firstMessage: "Protocolo JARVIS X-01 inicializado. Em que posso ajudá-lo hoje, senhor?",
          model: {
            provider: "openai",
            model: "gpt-4o-mini", // Use a more modern/available model
            messages: [
              { 
                role: "system", 
                content: "Sua personalidade é JARVIS, do Homem de Ferro. Você é polido, extremamente inteligente, e leal ao seu criador. Você responde sempre em Português do Brasil de forma concisa e elegante. Sempre chame o usuário de 'Senhor'. Você tem acesso a controles do sistema através de detecção de palavras-chave como 'abra', 'execute' ou 'navegar'." 
              }
            ]
          },
          voice: {
            provider: "playht", 
            voiceId: "s3://voice-training-east-1-pht-deployment/shannon_miller/shannon_miller_manifest.json", // Or a more standard one
          } as any,
        });
      }
    } catch (e) {
      console.error('[JARVIS] Critical Failure during initialization:', e);
      setIsConnecting(false);
    }
  };

  const stopCall = () => {
    console.log('[JARVIS] Relinquishing System Control...');
    vapiRef.current?.stop();
  };

  return {
    startCall,
    stopCall,
    isConnecting,
    activeCall,
    volumeLevel,
    transcript,
    isConnected: !!vapiRef.current,
    errorStatus,
    isConfigured: !!vapiPublicKey && vapiPublicKey !== 'YOUR_VAPI_PUBLIC_KEY'
  };
};
