import type { Socket } from "socket.io-client";

/**
 * Tipos para eventos do namespace /session
 */
export interface SessionStatus {
  status: "active" | "inactive";
  user_pin: string;
  jti: string;
  is_master: boolean;
  timestamp: string;
}

export interface SessionEvent {
  user_pin: string;
  jti: string;
  master_pin?: string;
  is_master?: boolean;
  event_type: string;
  [key: string]: unknown;
}

export interface TokenValidation {
  valid: boolean;
  user_pin: string;
  role: "MASTER" | "COLAB";
  timestamp: string;
}

export interface HeartbeatData {
  user_pin: string;
  jti: string;
  timestamp: string;
}

/**
 * Tipos para eventos do namespace /online-status
 */
export interface TeamStatus {
  master_pin: string;
  online_users: string[];
  total_users: number;
  timestamp: string;
}

export interface UserStatus {
  user_pin: string;
  is_online: boolean;
  last_seen: string;
  timestamp: string;
}

export interface OnlineStatusUpdate {
  user_pin: string;
  master_pin?: string;
  is_online: boolean;
  event_type?: string;
  [key: string]: unknown;
}

export interface StatusSubscription {
  subscribed_users: string[];
  timestamp: string;
}

export interface PresenceHeartbeat {
  user_pin: string;
  master_pin: string;
  timestamp: string;
}

/**
 * Tipos para configuração do socket
 */
export interface SocketConfig {
  url: string;
  withCredentials?: boolean;
  auth?: {
    token?: string;
  };
  reconnection?: boolean;
  reconnectionDelay?: number;
  reconnectionAttempts?: number;
}

/**
 * Tipos para os namespaces
 */
export type SocketNamespace = "/session" | "/online-status";

/**
 * Interface para o contexto do socket
 */
export interface SocketContextValue {
  // Conexões dos namespaces
  sessionSocket: Socket | null;
  onlineStatusSocket: Socket | null;
  
  // Estados de conexão
  isSessionConnected: boolean;
  isOnlineStatusConnected: boolean;
  
  // Métodos para conectar/desconectar
  connectSession: () => void;
  connectOnlineStatus: () => void;
  disconnectSession: () => void;
  disconnectOnlineStatus: () => void;
  disconnectAll: () => void;
  
  // Métodos auxiliares
  isConnected: (namespace: SocketNamespace) => boolean;
}

