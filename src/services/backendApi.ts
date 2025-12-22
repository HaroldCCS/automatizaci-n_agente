import axios from 'axios';
import type { Client, BackendInitResponse, BackendChatResponse } from '../types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const backendApi = {
  async initConversation(client: Client): Promise<BackendInitResponse> {
    try {
      const response = await axios.post<BackendInitResponse>(`${BACKEND_URL}/init`, client);
      return response.data;
    } catch (error) {
      console.error('Error initializing conversation:', error);
      throw error;
    }
  },

  async sendMessage(mensaje: string, telefono: number): Promise<BackendChatResponse> {
    try {
      const response = await axios.post<BackendChatResponse>(`${BACKEND_URL}/chat`, {
        message: mensaje,
        phone: telefono
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message to backend:', error);
      throw error;
    }
  }
};
