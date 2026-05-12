
export const WHITELISTED_APPS = {
  spotify: ['spotify', 'toca spotify', 'inicia spotify', 'musica', 'som', 'tocar musica', 'ouvir musica'],
  chrome: ['chrome', 'navegador', 'google chrome', 'google', 'internet', 'internet'],
  vscode: ['vs code', 'vscode', 'visual studio code', 'o codigo', 'visual studio', 'programar', 'editor', 'projeto'],
  youtube: ['youtube', 'video', 'videos'],
  google: ['google'],
  whatsapp: ['whatsapp', 'zap', 'mensagem', 'mensagens', 'conversa', 'cliente'],
  metaads: ['meta ads', 'facebook ads', 'anuncios', 'gerenciador de anuncios', 'campanhas', 'trafego pago'],
  chatgpt: ['chatgpt', 'chat gpt', 'gpt', 'inteligencia artificial', 'ia'],
  claude: ['claude', 'anthropic'],
  aistudio: ['google ai studio', 'ai studio', 'ia studio', 'google studio'],
  vercel: ['vercel', 'deploy', 'hospedagem', 'site no ar'],
  github: ['github', 'git hub', 'repositorio'],
  firebase: ['firebase', 'banco de dados', 'firestore', 'authentication', 'autenticacao'],
  downloads: ['downloads'],
  documents: ['documentos', 'jarvis root']
};

export const SEARCH_GOOGLE_PHRASES = [
  'pesquisa no google',
  'pesquise no google',
  'procura no google',
  'busca no google',
  'joga no google',
  'abre no google',
  'pesquisa',
  'pesquise',
  'procura',
  'busca',
  'joga'
];

export const SEARCH_YOUTUBE_PHRASES = [
  'pesquisa no youtube',
  'pesquise no youtube',
  'procura no youtube',
  'busca no youtube',
  'video de'
];

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Main command handler for Jarvis SPV
 * Handles both voice (Vapi) and text (Chat) inputs
 */
export async function handleJarvisCommand(text: string): Promise<{ executed: boolean; feedback?: string }> {
  let normalized = normalizeText(text);
  console.log("[JARVIS COMMAND]", text);

  // Remove "Jarvis" prefix if present
  if (normalized.startsWith('jarvis')) {
    normalized = normalized.replace(/^jarvis[, ]*/, '').trim();
  }

  if (!window.jarvisPC) {
    if (isPotentialCommand(normalized)) {
      return { 
        executed: true, 
        feedback: "Controle do PC disponível apenas no aplicativo desktop Electron." 
      };
    }
    return { executed: false };
  }

  // 1. System Commands (Screenshots, Folders, Volume)
  if (normalized.includes('print') || normalized.includes('captura a tela')) {
    const res = await window.jarvisPC.takeScreenshot();
    if (res.success) return { executed: true, feedback: "Print salvo em Documents/Jarvis-SPV/screenshots, senhor." };
  }

  if (normalized.includes('volume')) {
    if (normalized.includes('aumenta') || normalized.includes('mais')) {
      await window.jarvisPC.volumeUp();
      return { executed: true, feedback: "Volume aumentado, senhor." };
    }
    if (normalized.includes('diminui') || normalized.includes('baixa') || normalized.includes('menos')) {
      await window.jarvisPC.volumeDown();
      return { executed: true, feedback: "Volume diminuido, senhor." };
    }
    if (normalized.includes('muta') || normalized.includes('silencio')) {
      await window.jarvisPC.muteVolume();
      return { executed: true, feedback: "Audio silenciado, senhor." };
    }
  }

  // 2. YouTube Search Logic (Higher priority than just opening YouTube)
  for (const phrase of SEARCH_YOUTUBE_PHRASES) {
    if (normalized.includes(phrase)) {
      const query = normalized.split(phrase)[1]?.trim();
      if (query) {
        await window.jarvisPC.searchYoutube(query);
        return { executed: true, feedback: "Pesquisa aberta no YouTube, senhor." };
      }
    }
  }

  // 3. Google Search Logic (Higher priority than just opening Chrome)
  for (const phrase of SEARCH_GOOGLE_PHRASES) {
    if (normalized.includes(phrase)) {
      const query = normalized.split(phrase)[1]?.trim();
      if (query) {
        await window.jarvisPC.searchGoogle(query);
        return { executed: true, feedback: "Pesquisa aberta no Google, senhor." };
      }
    }
  }

  // 4. File Operations
  if (normalized.includes('cria um arquivo') || normalized.includes('criar arquivo')) {
     const name = normalized.includes('chamado') ? normalized.split('chamado')[1]?.trim().split(' ')[0] : `note_${Date.now()}.txt`;
     await window.jarvisPC.createFile({ name: name || 'note.txt', content: 'Neural note initialized.' });
     return { executed: true, feedback: `Arquivo ${name} criado com sucesso, senhor.` };
  }

  // 5. App Launching Mapping
  const appMapping: Record<string, string> = {
    'musica': 'spotify',
    'som': 'spotify',
    'spotify': 'spotify',
    'chrome': 'chrome',
    'google': 'chrome',
    'navegador': 'chrome',
    'internet': 'chrome',
    'codigo': 'vscode',
    'vscode': 'vscode',
    'programar': 'vscode',
    'video': 'youtube',
    'youtube': 'youtube',
    'whatsapp': 'whatsapp',
    'zap': 'whatsapp',
    'mensagem': 'whatsapp',
    'conversa': 'whatsapp',
    'cliente': 'whatsapp',
    'anuncios': 'metaads',
    'metaads': 'metaads',
    'meta ads': 'metaads',
    'facebook ads': 'metaads',
    'campanhas': 'metaads',
    'trafego pago': 'metaads',
    'ia': 'chatgpt',
    'inteligencia artificial': 'chatgpt',
    'gpt': 'chatgpt',
    'chatgpt': 'chatgpt',
    'claude': 'claude',
    'aistudio': 'aistudio',
    'ai studio': 'aistudio',
    'ia studio': 'aistudio',
    'vercel': 'vercel',
    'deploy': 'vercel',
    'github': 'github',
    'repositorio': 'github',
    'firebase': 'firebase',
    'banco de dados': 'firebase'
  };

  for (const [trigger, appId] of Object.entries(appMapping)) {
    const triggers = [trigger, `abre ${trigger}`, `abrir ${trigger}`, `abre o ${trigger}`, `abrir o ${trigger}`];
    if (triggers.some(t => normalized === t || normalized.endsWith(t))) {
      const res = await window.jarvisPC.openApp(appId);
      if (res.success) {
        const readableName = appId === 'metaads' ? 'Meta Ads' : appId === 'aistudio' ? 'Google AI Studio' : appId.charAt(0).toUpperCase() + appId.slice(1);
        return { executed: true, feedback: `${readableName} aberto, senhor.` };
      }
    }
  }

  return { executed: false };
}


function isPotentialCommand(text: string): boolean {
  const normalized = normalizeText(text);
  const keywords = ['abre', 'abrir', 'pesquisa', 'procura', 'print', 'volume', 'cria', 'salva', 'google', 'spotify', 'youtube', 'whatsapp', 'vscode', 'ia', 'gpt'];
  return keywords.some(k => normalized.includes(k));
}

/**
 * Enhanced extractor for Vapi messages
 */
export function extractUserTextFromVapiMessage(message: any): string {
  if (!message) return "";
  if (message.type === "transcript" && message.role === "user" && message.transcriptType === "final") {
    return message.transcript || "";
  }
  if (message.role === "user" && typeof message.content === "string") return message.content;
  return "";
}

