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
      openFolder: (folderName: string) => Promise<{ success: boolean }>;
      createFile: (data: { name: string; content: string; subfolder?: string }) => Promise<{ success: boolean; path?: string; error?: string }>;
      readFile: (data: { name: string; subfolder?: string }) => Promise<{ success: boolean; content?: string; error?: string }>;
      moveFile: (data: { oldPath: string; newPath: string }) => Promise<{ success: boolean; error?: string }>;
      renameFile: (data: { filePath: string; newName: string }) => Promise<{ success: boolean; path?: string; error?: string }>;
      takeScreenshot: () => Promise<{ success: boolean; path?: string; error?: string }>;
      volumeUp: () => Promise<{ success: boolean }>;
      volumeDown: () => Promise<{ success: boolean }>;
      muteVolume: () => Promise<{ success: boolean }>;
      requestConfirmation?: (message: string) => Promise<boolean>;
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
