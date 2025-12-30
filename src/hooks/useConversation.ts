import { useState, useRef } from 'react';
import type { Client, Profile, Message } from '../types';
import { backendApi } from '../services/backendApi';
import { geminiService } from '../services/geminiService';

const generateRandomPhone = (): number => {
  const timestamp = Date.now() % 1000000000;
  const random = Math.floor(Math.random() * 1000000000);
  const phone = 3000000000 + ((timestamp + random) % 1000000000);
  return phone;
};

interface UseConversationProps {
  client: Client;
  profile: Profile;
  maxIterations?: number;
}

export const useConversation = ({ client, profile, maxIterations = 10 }: UseConversationProps) => {
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [generatedPhone] = useState<number>(() => generateRandomPhone());
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [error, setError] = useState<string | undefined>();
  const isRunningRef = useRef(false);
  const hasStartedRef = useRef(false);
  const stopRef = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const runIteration = async (currentIteration: number, currentMessages: Message[]): Promise<Message[]> => {

    isRunningRef.current = true;
    setStatus('running');
    setError(undefined);

    try {
      let agentMessage: Message;

      if (currentIteration === 0) {
        const clientWithPhone = {
          ...client,
          Celular_cliente: generatedPhone
        };
        const initResponse = await backendApi.initConversation(clientWithPhone);
        setConversationId(initResponse.id);
        agentMessage = {
          role: 'agent',
          content: initResponse.messages[0].content,
          timestamp: new Date()
        };
      } else {
        const lastMessage = currentMessages[currentMessages.length - 1];

        const backendResponse = await backendApi.sendMessage(
          lastMessage.content,
          generatedPhone
        );

        agentMessage = {
          role: 'agent',
          content: backendResponse.agentMessage,
          timestamp: new Date()
        }
      }
      setMessages([...currentMessages, agentMessage]);
      const clientResponse = await geminiService.generateClientResponse(
        profile,
        [...currentMessages, agentMessage]
      );


      return [agentMessage, {
        role: 'client',
        content: clientResponse,
        timestamp: new Date()
      }];
    } catch (err) {
      console.error('Error in conversation:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err
    } finally {
      isRunningRef.current = false;
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const startAutoConversation = async () => {
    if (hasStartedRef.current) return;
    
    hasStartedRef.current = true;
    console.log('Starting auto conversation');
    
    const currentMessages: Message[] = [];
    for (let i = 0; i < maxIterations; i++) {
      if (stopRef.current) {
        setStatus('idle');
        break;
      }
      
      try {
      const [userMessage, agentMessage] = await runIteration(i, currentMessages);
      currentMessages.push(userMessage, agentMessage);
      setMessages(currentMessages);
      setStatus(i >= maxIterations ?'completed' : 'idle')
      } catch (error: unknown) {
        console.error('Stop; Error in conversation:', error);
        return;
      }
    }
  }

  const forceExtraIteration = () => {

  }

  const stopConversation = () => {
    stopRef.current = true;
    setStatus('idle');
  }

  return {
    conversationId,
    generatedPhone,
    messages,
    maxIterations,
    status,
    error,
    runIteration,
    startAutoConversation,
    forceExtraIteration,
    stopConversation
  };
};
