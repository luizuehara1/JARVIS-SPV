import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

export function useVapi() {
  const vapiRef = useRef<any>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
  const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

  useEffect(() => {
    if (!publicKey || !assistantId) {
      console.error("[JARVIS] Missing Vapi env vars", { publicKey, assistantId });
      setError("VAPI_KEY_MISSING");
      return;
    }

    try {
      console.log("[JARVIS] Initializing Vapi SDK...");
      const vapi = new Vapi(publicKey);
      vapiRef.current = vapi;

      vapi.on("call-start", () => {
        console.log("[JARVIS] Call started");
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
      });

      vapi.on("call-end", () => {
        console.log("[JARVIS] Call ended");
        setIsConnected(false);
        setIsConnecting(false);
        setIsSpeaking(false);
      });

      vapi.on("speech-start", () => {
        console.log("[JARVIS] Assistant speaking");
        setIsSpeaking(true);
      });

      vapi.on("speech-end", () => {
        console.log("[JARVIS] Assistant stopped speaking");
        setIsSpeaking(false);
      });

      vapi.on("message", (message: any) => {
        console.log("[JARVIS MESSAGE]", message);
        setMessages((prev) => [...prev, message]);
      });

      vapi.on("error", (err: any) => {
        console.error("[JARVIS ERROR RAW]", err);
        try {
          console.error("[JARVIS ERROR JSON]", JSON.stringify(err, null, 2));
        } catch {
          console.error("[JARVIS ERROR STRING]", String(err));
        }
        setError("VAPI_CONNECTION_ERROR");
        setIsConnecting(false);
        setIsConnected(false);
      });

      return () => {
        try {
          vapi.stop();
        } catch {}
      };
    } catch (err: any) {
      console.error("[JARVIS INIT ERROR RAW]", err);
      setError("VAPI_INIT_ERROR");
    }
  }, [publicKey, assistantId]);

  const start = async () => {
    if (!vapiRef.current) {
      setError("VAPI_NOT_INITIALIZED");
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      
      // Request microphone permission first as requested
      await navigator.mediaDevices.getUserMedia({ audio: true }).catch(err => {
        console.error("[JARVIS MIC ERROR]", err);
        throw new Error("MIC_PERMISSION_DENIED");
      });

      console.log("[JARVIS] Connecting to assistant:", assistantId);
      await vapiRef.current.start(assistantId);
    } catch (err: any) {
      console.error("[JARVIS START ERROR RAW]", err);
      try {
        console.error("[JARVIS START ERROR JSON]", JSON.stringify(err, null, 2));
      } catch {
        console.error("[JARVIS START ERROR STRING]", String(err));
      }
      
      if (err.message === "MIC_PERMISSION_DENIED") {
        setError("MIC_PERMISSION_DENIED");
      } else {
        setError("VAPI_START_ERROR");
      }
      
      setIsConnecting(false);
      setIsConnected(false);
    }
  };

  const stop = () => {
    try {
      vapiRef.current?.stop();
      setIsConnected(false);
      setIsConnecting(false);
      setIsSpeaking(false);
    } catch (err) {
      console.error("[JARVIS STOP ERROR]", err);
    }
  };

  return {
    start,
    stop,
    isConnected,
    isConnecting,
    isSpeaking,
    error,
    messages,
    isConfigured: Boolean(publicKey && assistantId),
  };
}
