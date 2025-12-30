import { useEffect, useMemo, useRef, useState } from "react";
import type { Client, Message } from "../types";
import { backendApi } from "../services/backendApi";
import clients from "../data/clients.json";

const ManualChat = ({ close }: { close: () => void }) => {

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [manualStatus, setManualStatus] = useState<'idle' | 'starting' | 'ready' | 'sending' | 'error'>('idle');
  const [manualError, setManualError] = useState<string | undefined>();
  const [selectedClientIndex, setSelectedClientIndex] = useState(0);
  const [manualPhone, setManualPhone] = useState<number | undefined>();
  const [manualMessages, setManualMessages] = useState<Message[]>([]);
  const [manualInput, setManualInput] = useState('');

  const selectedClient = useMemo(() => clients[selectedClientIndex], [clients, selectedClientIndex]);

  const generateRandomPhone = (): number => {
    const timestamp = Date.now() % 1000000000;
    const random = Math.floor(Math.random() * 1000000000);
    const phone = 3000000000 + ((timestamp + random) % 1000000000);
    return phone;
  };

  const startManualConversation = async () => {
    if (!selectedClient) return;

    setManualStatus('starting');
    setManualError(undefined);
    setManualMessages([]);
    setManualInput('');

    const phone = generateRandomPhone();
    setManualPhone(phone);

    try {
      const clientWithPhone: Client = {
        ...selectedClient,
        Celular_cliente: phone
      };

      const initResponse = await backendApi.initConversation(clientWithPhone);
      const initialAgent = initResponse.messages?.[0]?.content ?? '';

      if (!initialAgent) {
        throw new Error('El backend no devolvió el mensaje inicial del agente');
      }

      setManualMessages([
        {
          role: 'agent',
          content: initialAgent,
          timestamp: new Date()
        }
      ]);
      setManualStatus('ready');
    } catch (err) {
      setManualStatus('error');
      setManualError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const sendManualMessage = async () => {
    if (manualStatus !== 'ready') return;
    if (!manualPhone) return;

    const text = manualInput.trim();
    if (!text) return;

    setManualStatus('sending');
    setManualError(undefined);

    const userMessage: Message = {
      role: 'client',
      content: text,
      timestamp: new Date()
    };

    setManualMessages(prev => [...prev, userMessage]);
    setManualInput('');

    try {
      const backendResponse = await backendApi.sendMessage(text, manualPhone);
      const agentMessage: Message = {
        role: 'agent',
        content: backendResponse.agentMessage,
        timestamp: new Date()
      };
      setManualMessages(prev => [...prev, agentMessage]);
      setManualStatus('ready');
    } catch (err) {
      setManualStatus('error');
      setManualError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [manualMessages]);


  return (
            <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-700">Cliente (desde JSON)</div>
                      <select
                        className="mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
                        value={selectedClientIndex}
                        onChange={(e) => setSelectedClientIndex(Number(e.target.value))}
                        disabled={manualStatus === 'starting' || manualStatus === 'sending'}
                      >
                        {clients.map((c, idx) => (
                          <option key={`${c.NOMBRE_CLIENTE}-${idx}`} value={idx}>
                            {c.NOMBRE_CLIENTE}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="text-sm text-gray-600">
                      <div className="font-semibold text-gray-700">Teléfono sesión</div>
                      <div className="mt-1">
                        {manualPhone ? manualPhone : '—'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={startManualConversation}
                      disabled={manualStatus === 'starting' || manualStatus === 'sending'}
                      className={`px-4 py-2 rounded font-semibold text-white text-sm transition-colors ${
                        manualStatus === 'starting' || manualStatus === 'sending'
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {manualStatus === 'starting' ? 'Iniciando...' : 'Iniciar conversación (Agente primero)'}
                    </button>

                    <button
                      onClick={() => close()}
                      className="px-4 py-2 rounded font-semibold text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Este modo es manual: tú escribes como cliente y el agente responde desde el backend (sin Gemini).
                </div>
              </div>

              <div className="h-[420px] overflow-y-auto p-4 bg-white space-y-3">
                {manualMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>Selecciona un cliente y presiona “Iniciar conversación”.</p>
                  </div>
                ) : (
                  manualMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'agent' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === 'agent'
                            ? 'bg-gray-50 text-gray-800 border border-gray-200'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        <div className="text-xs opacity-70 mb-1">
                          {message.role === 'agent' ? 'Agente' : 'Tú'}
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

              <div className="border-t border-gray-200 p-3 bg-gray-50">
                {manualError && (
                  <div className="mb-2 text-sm text-red-600">
                    <strong>Error:</strong> {manualError}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') sendManualMessage();
                    }}
                    disabled={manualStatus !== 'ready'}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder={manualStatus === 'ready' ? 'Escribe tu mensaje...' : 'Inicia la conversación para habilitar el chat'}
                  />
                  <button
                    onClick={sendManualMessage}
                    disabled={manualStatus !== 'ready' || !manualInput.trim()}
                    className={`px-4 py-2 rounded font-semibold text-white text-sm transition-colors ${
                      manualStatus !== 'ready' || !manualInput.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {manualStatus === 'sending' ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </div>
            </div>
  );
}

export default ManualChat;