export interface Client {
  Llave: string;
  NOMBRE_CLIENTE: string;
  Segmento_del_cliente_en_el_banco: string;
  Segmento_Proyectado: string;
  Ciudad_del_cliente: string;
  "Edad del cliente": string;
  "Genero cliente": string;
  Celular_cliente: number;
  Aplica_cuota_de_manejo: string;
  Cupo_tarjeta_de_crédito: number;
  Categoría_Tarjeta: string;
  "Tipo Tarjeta": string;
  Marca_de_Tarjeta: string;
  Franquicia_Tarjeta: string;
  Cupo_Crédito_Libre_inversión: number;
  Tasa_del_crédito: number;
  Plazo_del_crédito: number;
  vencimiento_de_la_oferta: number;
  CAMPAIGN_ID: number;
  Id_de_registro: number;
  Tasa_Mínima_RM1: number | null;
  Tasa_Mínima_RM2: number | null;
  Tasa_Mínima_RM3: number | null;
}

export interface Profile {
  perfil: string;
  prompt: string;
}

export interface Message {
  role: 'agent' | 'client';
  content: string;
  timestamp: Date;
}

export interface ConversationState {
  _id?: string;
  client: Client;
  profile: Profile;
  generatedPhone: number;
  messages: Message[];
  iteration: number;
  maxIterations: number;
  status: 'idle' | 'running' | 'completed' | 'error';
  error?: string;
}


export interface ChatMessage {
  // Nota: En tu JSON aparece 'assistant', que equivale al rol 'model' en Gemini
  role: 'user' | 'assistant' | 'model' | 'system' | 'function';
  content: string;
  timestamp: string; // ISO Date string
}

export interface BackendInitResponse {
  id: string;
  sessionId: string;
  key: string;
  origin: string;
  destination: string;
  createdAt: string; // ISO Date string
  customerName: string;
  customerSegment: string;
  projectedSegment: string;
  city: string;
  age: string; // Ejemplo: "29-35"
  gender: 'M' | 'F' | string;
  creditCardManagmentFee: 'Y' | 'N';
  creditCardLimit: number;
  creditCardCategory: string;
  creditCardType: string;
  creditCardBrand: string;
  creditCardFranchise: string;
  creditLimit: number;
  rateCredit: string; // Viene como string "1.4"
  installmentsCredit: number;
  offerExpirationDate: number; // Formato YYYYMMDD según tu ejemplo (20251130)
  campaignId: number;
  registrationId: number;
  minRateRm1: string;
  minRateRm2: string;
  minRateRm3: string;
  status: 'OPEN' | 'CLOSED' | string;
  messages: ChatMessage[];
  updatedAt: string; // ISO Date string
}

export interface BackendChatResponse {
  agentMessage: string;
}
