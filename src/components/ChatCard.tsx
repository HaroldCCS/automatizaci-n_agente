import { useEffect, useRef, useState } from 'react';
import type { Client, Profile } from '../types';
import { useConversation } from '../hooks/useConversation';

interface ChatCardProps {
  client: Client;
  profile: Profile;
  autoStart?: boolean;
  onDelete?: () => void;
}

export const ChatCard = ({ client, profile, autoStart = false, onDelete }: ChatCardProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversation = useConversation({ client, profile, maxIterations: 10 });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (autoStart) conversation.startAutoConversation();
  }, [autoStart, conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  const getStatusColor = () => {
    switch (conversation.status) {
      case 'running':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (conversation.status) {
      case 'running':
        return 'En progreso';
      case 'completed':
        return 'Completado';
      case 'error':
        return 'Error';
      default:
        return 'Esperando';
    }
  };

  return (
    <>
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[800px]">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg truncate flex-1">
            {client.NOMBRE_CLIENTE}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(true)}
              className="p-1.5 hover:bg-white/20 rounded transition-colors"
              title="Expandir chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                title="Eliminar conversación"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <div className={`${getStatusColor()} text-white text-xs px-2 py-1 rounded-full`}>
              {getStatusText()}
            </div>
          </div>
        </div>
        <div className="text-sm opacity-90">
          <p className="truncate">{profile.perfil}</p>
          <p className="text-xs mt-1">
            Tel: {conversation.generatedPhone}
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 bg-white/20 rounded px-2 py-1 text-center text-sm font-semibold">
            Mensaje {conversation.messages.length}
          </div>
          {conversation.status === 'running'  && (
            <button
              onClick={conversation.stopConversation}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
              title="Detener conversación"
            >
              Detener
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
        {conversation.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Esperando inicio de conversación...</p>
          </div>
        ) : (
          conversation.messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'agent' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'agent'
                    ? 'bg-white text-gray-800 shadow'
                    : 'bg-blue-500 text-white'
                }`}
              >
                <div className="text-xs opacity-70 mb-1">
                  {message.role === 'agent' ? 'Agente' : 'Cliente'}
                </div>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <div className="text-xs opacity-60 mt-1 text-right">
                  {new Date(message.timestamp).toLocaleTimeString('es-CO', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {conversation.error && (
        <div className="bg-red-50 border-t border-red-200 p-3">
          <p className="text-red-600 text-sm">
            <strong>Error:</strong> {conversation.error}
          </p>
        </div>
      )}

      {conversation.status === 'completed' && (
        <div className="bg-gray-100 border-t border-gray-200 p-3">
          <button
            onClick={conversation.forceExtraIteration}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Forzar Iteración Extra
          </button>
        </div>
      )}
    </div>

    {isExpanded && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsExpanded(false)}>
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-2xl">
                {client.NOMBRE_CLIENTE}
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-white/20 rounded transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-base opacity-90">
              <p className="font-medium">{profile.perfil}</p>
              <p className="text-sm mt-1">Tel: {conversation.generatedPhone}</p>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <div className="bg-white/20 rounded px-3 py-1.5 text-sm font-semibold">
                Mensaje {conversation.messages.length}
              </div>
              <div className={`${getStatusColor()} text-white text-sm px-3 py-1.5 rounded-full font-semibold`}>
                {getStatusText()}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
            {conversation.messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p className="text-lg">Esperando inicio de conversación...</p>
              </div>
            ) : (
              conversation.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'agent' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-5 py-3 ${
                      message.role === 'agent'
                        ? 'bg-white text-gray-800 shadow-md'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    <div className="text-xs opacity-70 mb-2 font-semibold">
                      {message.role === 'agent' ? 'Agente' : 'Cliente'}
                    </div>
                    <p className="text-base whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <div className="text-xs opacity-60 mt-2 text-right">
                      {new Date(message.timestamp).toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {conversation.error && (
            <div className="bg-red-50 border-t border-red-200 p-4">
              <p className="text-red-600">
                <strong>Error:</strong> {conversation.error}
              </p>
            </div>
          )}

          {conversation.status === 'completed' && (
            <div className="bg-gray-100 border-t border-gray-200 p-4">
              <button
                onClick={conversation.forceExtraIteration}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-base"
              >
                Forzar Iteración Extra
              </button>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  );
};
