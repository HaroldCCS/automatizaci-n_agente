import { GoogleGenerativeAI, type Content } from '@google/generative-ai';
import type { Message, Profile } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

const initializeGemini = () => {
  if (!genAI && API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
};

export const geminiService = {
  async generateClientResponse(
    profile: Profile,
    conversationHistory: Message[]
  ): Promise<string> {
    try {
      const ai = initializeGemini();
      
      if (!ai) {
        throw new Error('Gemini API key not configured');
      }

      const model = ai.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: `Eres un cliente de Davibank con el siguiente perfil y comportamiento:
-------------------------------------------------------------------------------------------------------------------
${profile.prompt}
-------------------------------------------------------------------------------------------------------------------

Comportamiento:
- Responde de forma natural y concisa como un humano simplista que abrevia las conversaciones
- Mantén el tono y comportamiento descrito en tu perfil
- Sé directo y usa máximo 2-3 oraciones por respuesta
- Usa lenguaje coloquial y abreviaciones cuando sea natural`
      });

      const contents: Content[]  = conversationHistory.map(msg => ({
        role: msg.role === 'agent' ? 'user' : 'model',
        parts: [{ 
          text: msg.content 
        }]
      }));

      // Gemini requiere que la conversación termine con un mensaje del usuario
      // Si el último mensaje es del modelo, agregamos un prompt para que el cliente responda
      const lastMessage = contents[contents.length - 1];
      if (lastMessage && lastMessage.role === 'model') {
        contents.push({
          role: 'user',
          parts: [{ text: '...' }]
        });
      }

      const result = await model.generateContent({ 
        contents: contents 
      });
      const response = await result.response;
      const text = response.text();

      return text.trim();
    } catch (error) {
      console.error('Error generating Gemini response:', error);
      throw error;
    }
  }
};
