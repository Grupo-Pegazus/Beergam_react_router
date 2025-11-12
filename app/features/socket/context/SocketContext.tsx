import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";
import type { SocketContextValue, SocketNamespace } from "../typings/socket.types";

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
  socketUrl?: string;
  isAuthenticated?: boolean;
}

/**
 * Função auxiliar para obter o token de acesso dos cookies
 */
function getAccessTokenFromCookies(): string | null {
  if (typeof document === "undefined") return null;
  
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "access_token") {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * Provider do Socket.IO que gerencia conexões com múltiplos namespaces
 */
export function SocketProvider({
  children,
  socketUrl,
  isAuthenticated = false,
}: SocketProviderProps) {
  const [sessionSocket, setSessionSocket] = useState<Socket | null>(null);
  const [onlineStatusSocket, setOnlineStatusSocket] = useState<Socket | null>(null);
  const [isSessionConnected, setIsSessionConnected] = useState(false);
  const [isOnlineStatusConnected, setIsOnlineStatusConnected] = useState(false);
  
  const socketUrlRef = useRef<string>(
    socketUrl || import.meta.env.VITE_SOCKET_URL || "http://localhost:3001"
  );
  const isAuthenticatedRef = useRef(isAuthenticated);

  // Atualizar ref quando isAuthenticated mudar
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  /**
   * Conectar ao namespace /session
   */
  const connectSession = () => {
    if (sessionSocket?.connected) {
      console.log("Socket /session já está conectado");
      return;
    }

    if (!isAuthenticatedRef.current) {
      console.warn("Tentativa de conectar socket sem autenticação");
      return;
    }

    const token = getAccessTokenFromCookies();
    
    const socket = io(`${socketUrlRef.current}/session`, {
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
      upgrade: true,
      rememberUpgrade: true,
      ...(token && { auth: { token } }),
    });

    socket.on("connect", () => {
      console.log("✅ Conectado ao namespace /session");
      setIsSessionConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Desconectado do namespace /session:", reason);
      setIsSessionConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Erro ao conectar ao namespace /session:", error);
      if (error.message.includes("CORS") || error.message.includes("xhr poll error")) {
        console.error(
          "⚠️ Erro de CORS detectado. " +
          "Certifique-se de que a origem do front-end está configurada no servidor Socket. " +
          `Origem atual: ${window.location.origin}`
        );
      }
      setIsSessionConnected(false);
    });

    socket.on("session_event", (data) => {
      console.log("📨 Evento de sessão recebido:", data);
    });

    socket.on("heartbeat", (data) => {
      console.log("💓 Heartbeat recebido:", data);
    });

    setSessionSocket(socket);
  };

  /**
   * Conectar ao namespace /online-status
   */
  const connectOnlineStatus = () => {
    if (onlineStatusSocket?.connected) {
      console.log("Socket /online-status já está conectado");
      return;
    }

    if (!isAuthenticatedRef.current) {
      console.warn("Tentativa de conectar socket sem autenticação");
      return;
    }

    const token = getAccessTokenFromCookies();
    
    const socket = io(`${socketUrlRef.current}/online-status`, {
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
      upgrade: true,
      rememberUpgrade: true,
      ...(token && { auth: { token } }),
    });

    socket.on("connect", () => {
      console.log("✅ Conectado ao namespace /online-status");
      setIsOnlineStatusConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Desconectado do namespace /online-status:", reason);
      setIsOnlineStatusConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Erro ao conectar ao namespace /online-status:", error);
      if (error.message.includes("CORS") || error.message.includes("xhr poll error")) {
        console.error(
          "⚠️ Erro de CORS detectado. " +
          "Certifique-se de que a origem do front-end está configurada no servidor Socket. " +
          `Origem atual: ${window.location.origin}`
        );
      }
      setIsOnlineStatusConnected(false);
    });

    socket.on("online_status_update", (data) => {
      console.log("📨 Atualização de status online recebida:", data);
    });

    socket.on("presence_heartbeat", (data) => {
      console.log("💓 Presence heartbeat recebido:", data);
    });

    socket.on("status_subscription_confirmed", (data) => {
      console.log("✅ Inscrição de status confirmada:", data);
    });

    setOnlineStatusSocket(socket);
  };

  /**
   * Desconectar do namespace /session
   */
  const disconnectSession = () => {
    if (sessionSocket) {
      sessionSocket.disconnect();
      setSessionSocket(null);
      setIsSessionConnected(false);
      console.log("🔌 Desconectado do namespace /session");
    }
  };

  /**
   * Desconectar do namespace /online-status
   */
  const disconnectOnlineStatus = () => {
    if (onlineStatusSocket) {
      onlineStatusSocket.disconnect();
      setOnlineStatusSocket(null);
      setIsOnlineStatusConnected(false);
      console.log("🔌 Desconectado do namespace /online-status");
    }
  };

  /**
   * Desconectar de todos os namespaces
   */
  const disconnectAll = () => {
    disconnectSession();
    disconnectOnlineStatus();
  };

  /**
   * Verificar se um namespace está conectado
   */
  const isConnected = (namespace: SocketNamespace): boolean => {
    if (namespace === "/session") {
      return isSessionConnected && sessionSocket?.connected === true;
    }
    if (namespace === "/online-status") {
      return isOnlineStatusConnected && onlineStatusSocket?.connected === true;
    }
    return false;
  };

  // Conectar/desconectar baseado no estado de autenticação
  useEffect(() => {
    // Só conectar se autenticado e ainda não conectado
    if (isAuthenticated) {
      if (!sessionSocket?.connected) {
        connectSession();
      }
      if (!onlineStatusSocket?.connected) {
        connectOnlineStatus();
      }
    } else {
      // Só desconectar se estiver conectado
      if (sessionSocket?.connected || onlineStatusSocket?.connected) {
        disconnectAll();
      }
    }

    // Cleanup ao desmontar
    return () => {
      if (sessionSocket || onlineStatusSocket) {
        disconnectAll();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const value: SocketContextValue = {
    sessionSocket,
    onlineStatusSocket,
    isSessionConnected,
    isOnlineStatusConnected,
    connectSession,
    connectOnlineStatus,
    disconnectSession,
    disconnectOnlineStatus,
    disconnectAll,
    isConnected,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

/**
 * Hook para acessar o contexto do socket
 */
export function useSocketContext(): SocketContextValue {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocketContext deve ser usado dentro de SocketProvider");
  }
  return context;
}

