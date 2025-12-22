import { useState } from 'react';
import { ChatCard } from '../components/ChatCard';
import clientsData from '../data/clients.json';
import profilesData from '../data/profiles.json';
import type { Client, Profile } from '../types';

export const Dashboard = () => {
  const [autoStart, setAutoStart] = useState(false);
  const clients = clientsData as Client[];
  const profiles = profilesData as Profile[];

  const initialClientsWithProfiles = clients.map((client, index) => ({
    id: `${client.NOMBRE_CLIENTE}-${index}`,
    client,
    profile: profiles[index % profiles.length]
  }));

  const [activeConversations, setActiveConversations] = useState(initialClientsWithProfiles);

  const handleDeleteConversation = (id: string) => {
    setActiveConversations(prev => prev.filter(conv => conv.id !== id));
  };

  const handleStartTests = () => {
    setAutoStart(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dashboard de Automatización de Pruebas de IA
          </h1>
          <p className="text-gray-600">
            Simulación de conversaciones entre clientes (Gemini) y agente de ventas (Backend)
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-4">
            <button
              onClick={handleStartTests}
              disabled={autoStart}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                autoStart
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
              }`}
            >
              {autoStart ? 'Pruebas en Ejecución...' : 'Iniciar Pruebas Automáticas'}
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Nota:</strong> Cada conversación se ejecuta de forma independiente. Si una falla, las demás continúan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeConversations.map((item) => (
            <ChatCard
              key={item.id}
              client={item.client}
              profile={item.profile}
              autoStart={autoStart}
              onDelete={() => handleDeleteConversation(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
