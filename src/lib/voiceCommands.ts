
export const WHITELISTED_APPS = {
  spotify: ['spotify', 'toca spotify', 'inicia spotify'],
  chrome: ['chrome', 'navegador', 'google chrome'],
  vscode: ['vs code', 'vscode', 'visual studio code', 'o código', 'visual studio'],
  youtube: ['youtube'],
  google: ['google'],
  whatsapp: ['whatsapp', 'zap'],
  metaads: ['meta ads', 'gerenciador de anúncios', 'facebook ads'],
  chatgpt: ['chatgpt', 'chat gpt'],
  claude: ['claude'],
  aistudio: ['google ai studio', 'ai studio', 'ia studio'],
  vercel: ['vercel'],
  github: ['github'],
  firebase: ['firebase']
};

export const SEARCH_GOOGLE_PHRASES = [
  'pesquisa no google',
  'pesquise no google',
  'procura no google',
  'busca no google',
  'joga no google',
  'abre no google'
];

export const SEARCH_YOUTUBE_PHRASES = [
  'pesquisa no youtube',
  'pesquise no youtube',
  'procura no youtube',
  'busca no youtube'
];

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export async function handleJarvisVoiceCommand(text: string): Promise<{ executed: boolean; feedback?: string }> {
  const normalized = normalizeText(text);
  console.log("[VOICE COMMAND TEXT]", text);

  if (!window.jarvisPC) {
    if (isCommand(normalized)) {
      return { 
        executed: true, 
        feedback: "Controle do PC disponível apenas no aplicativo desktop Electron." 
      };
    }
    return { executed: false };
  }

  // 1. YouTube Search
  for (const phrase of SEARCH_YOUTUBE_PHRASES) {
    if (normalized.includes(phrase)) {
      const query = normalized.split(phrase)[1]?.trim();
      if (query) {
        await window.jarvisPC.searchYoutube(query);
        console.log("[VOICE COMMAND EXECUTED] youtube-search:", query);
        return { executed: true, feedback: "Pesquisa aberta no YouTube, senhor." };
      }
    }
  }

  // 2. Google Search
  for (const phrase of SEARCH_GOOGLE_PHRASES) {
    if (normalized.includes(phrase)) {
      const query = normalized.split(phrase)[1]?.trim();
      if (query) {
        await window.jarvisPC.searchGoogle(query);
        console.log("[VOICE COMMAND EXECUTED] google-search:", query);
        return { executed: true, feedback: "Pesquisa aberta no Google, senhor." };
      }
    }
  }

  // 3. Open Apps
  for (const [appId, variations] of Object.entries(WHITELISTED_APPS)) {
    for (const variation of variations) {
      const openPhrases = [`abre ${variation}`, `abrir ${variation}`, `abre o ${variation}`, `abrir o ${variation}`];
      if (openPhrases.some(p => normalized.includes(p)) || (appId === 'spotify' && normalized.includes('toca spotify'))) {
        await window.jarvisPC.openApp(appId);
        console.log("[VOICE COMMAND EXECUTED] open-app:", appId);
        return { 
          executed: true, 
          feedback: `${appId.charAt(0).toUpperCase() + appId.slice(1)} aberto, senhor.` 
        };
      }
    }
  }

  return { executed: false };
}

function isCommand(text: string): boolean {
  const normalized = normalizeText(text);
  const allVariations = Object.values(WHITELISTED_APPS).flat();
  const hasAppCommand = allVariations.some(v => normalized.includes(`abre ${v}`) || normalized.includes(`abrir ${v}`));
  const hasSearchCommand = [...SEARCH_GOOGLE_PHRASES, ...SEARCH_YOUTUBE_PHRASES].some(p => normalized.includes(p));
  return hasAppCommand || hasSearchCommand;
}

export function extractUserTextFromVapiMessage(message: any): string {
  if (!message) return "";
  
  // Standard Vapi Message format
  if (message.type === "transcript" && message.role === "user" && message.transcriptType === "final") {
    return message.transcript || "";
  }
  
  // Fallbacks for variations
  if (message.role === "user" && typeof message.content === "string") return message.content;
  if (typeof message.transcript === "string" && message.role === "user") return message.transcript;
  if (typeof message.message === "string" && message.role === "user") return message.message;
  
  return "";
}
