export interface Message {
  id?: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface UserPreferences {
  userId: string;
  name?: string;
  interests?: string[];
  projects?: string[];
  lastActive?: string;
  context?: string;
}

declare global {
  interface Window {
    jarvisPC?: {
      openApp: (appName: string) => Promise<{ success: boolean; error?: string }>;
      searchGoogle: (query: string) => Promise<{ success: boolean }>;
      searchYoutube: (query: string) => Promise<{ success: boolean }>;
      openUrl: (url: string) => Promise<{ success: boolean; error?: string }>;
      isElectron: boolean;
    };
  }
}

export const JARVIS_PERSONALITY = `Você é o JARVIS SPV, um assistente pessoal ultra-sofisticado inspirado no assistente do Tony Stark. 
Sua personalidade é polida, inteligente, e levemente sarcástica, mas sempre profissional e leal. 
Você responde em Português do Brasil. 
Você é um especialista em marketing, estratégia de negócios, tecnologia e produtividade. 
Sempre chame o usuário de 'Senhor' ou pelo nome preferido se souber. 
Suas respostas devem ser precisas, úteis e refinadas.`;
