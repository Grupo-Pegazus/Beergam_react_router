import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, type Socket } from "socket.io-client";
import { showNotification } from "~/features/notifications/showNotification";
import type { OnlineStatusNotificationData } from "~/features/notifications/types";
import { updateColab } from "~/features/user/redux";
import { isMaster } from "~/features/user/utils";
import type { RootState } from "~/store";
import type {
  OnlineStatusUpdate,
  SocketContextValue,
  SocketNamespace,
} from "../typings/socket.types";

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

// function showOnlineStatusToast(
//   update: OnlineStatusUpdate,
//   colab: IColab | null
// ) {
//   const statusLabel = update.is_online ? "ficou online" : "ficou offline";
//   const eventLabel =
//     update.event_type === "bulk_update"
//       ? "Atualização de equipe"
//       : "Atualização de presença";
//   // if (user && isMaster(user)) {
//   //   colab = (user as IUser).colabs?.[update.user_pin];
//   // }
//   // toast.custom(
//   //   (t) => (
//   //     <div
//   //       style={{
//   //         display: "flex",
//   //         alignItems: "flex-start",
//   //         gap: "12px",
//   //         backgroundColor: "#0f172a",
//   //         color: "#f8fafc",
//   //         padding: "14px 18px",
//   //         borderRadius: "14px",
//   //         boxShadow: "0px 20px 45px rgba(15, 23, 42, 0.35)",
//   //         borderLeft: `5px solid ${
//   //           update.is_online ? "var(--color-beergam-green)" : "#f97316"
//   //         }`,
//   //         transform: t.visible ? "translateX(0)" : "translateX(24px)",
//   //         opacity: t.visible ? 1 : 0,
//   //         transition: "all 0.3s ease",
//   //         minWidth: "320px",
//   //         maxWidth: "380px",
//   //         fontFamily: "Satoshi, Inter, sans-serif",
//   //       }}
//   //     >
//   //       <div
//   //         style={{
//   //           width: 36,
//   //           height: 36,
//   //           minWidth: 36,
//   //           borderRadius: "50%",
//   //           backgroundColor: update.is_online ? "#22c55e1a" : "#f973161a",
//   //           display: "flex",
//   //           alignItems: "center",
//   //           justifyContent: "center",
//   //           color: update.is_online ? "var(--color-beergam-green)" : "#fb923c",
//   //           fontWeight: 600,
//   //           fontSize: 18,
//   //         }}
//   //       >
//   //         {update.is_online ? "●" : "○"}
//   //       </div>
//   //       <div style={{ flex: 1 }}>
//   //         <p
//   //           style={{
//   //             margin: 0,
//   //             fontSize: 13,
//   //             letterSpacing: 0.4,
//   //             textTransform: "uppercase",
//   //             color: "#94a3b8",
//   //             fontWeight: 600,
//   //           }}
//   //         >
//   //           {eventLabel}
//   //         </p>
//   //         <p
//   //           style={{
//   //             margin: "4px 0 0",
//   //             fontSize: 15,
//   //             fontWeight: 600,
//   //           }}
//   //         >
//   //           Usuário {update.user_pin}
//   //         </p>
//   //         <p
//   //           style={{
//   //             margin: "4px 0 0",
//   //             fontSize: 14,
//   //             color: "#cbd5f5",
//   //           }}
//   //         >
//   //           {statusLabel}
//   //           {update.master_pin ? ` · Master ${update.master_pin}` : ""}
//   //         </p>
//   //       </div>
//   //       <button
//   //         onClick={() => toast.dismiss(t.id)}
//   //         style={{
//   //           appearance: "none",
//   //           border: "none",
//   //           background: "transparent",
//   //           color: "#94a3b8",
//   //           cursor: "pointer",
//   //           fontSize: 18,
//   //           lineHeight: 1,
//   //           padding: 0,
//   //           marginLeft: 4,
//   //         }}
//   //         aria-label="Fechar notificação"
//   //       >
//   //         ×
//   //       </button>
//   //     </div>
//   //   ),
//   //   {
//   //     id: `online-status-${update.user_pin}-${Date.now()}`,
//   //     duration: 4000,
//   //     position: "bottom-right",
//   //     toasterId: "notifications",
//   //   }
//   // );
//   toast(
//     "Usuário " +
//       (colab?.name || `Não identificado`) +
//       " " +
//       statusLabel +
//       " no evento " +
//       eventLabel,
//     {
//       toasterId: "notifications",
//       icon: update.is_online ? "🟢" : "🔴",
//     }
//   );
// }

/**
 * Provider do Socket.IO que gerencia conexões com múltiplos namespaces
 */
export function SocketProvider({
  children,
  socketUrl,
  isAuthenticated = false,
}: SocketProviderProps) {
  const [sessionSocket, setSessionSocket] = useState<Socket | null>(null);
  const [onlineStatusSocket, setOnlineStatusSocket] = useState<Socket | null>(
    null
  );
  const user = useSelector((state: RootState) => state.user.user);
  const [isSessionConnected, setIsSessionConnected] = useState(false);
  const [isOnlineStatusConnected, setIsOnlineStatusConnected] = useState(false);
  const dispatch = useDispatch();
  const socketUrlRef = useRef<string>(
    socketUrl || import.meta.env.VITE_SOCKET_URL || "http://localhost:3001"
  );
  const isAuthenticatedRef = useRef(isAuthenticated);
  const userRef = useRef(user);

  // Atualizar ref quando isAuthenticated mudar
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

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

    // Se já existe um socket desconectado, limpar antes de criar um novo
    if (sessionSocket) {
      sessionSocket.removeAllListeners();
      sessionSocket.disconnect();
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
      if (
        error.message.includes("CORS") ||
        error.message.includes("xhr poll error")
      ) {
        console.error(
          "⚠️ Erro de CORS detectado. " +
            "Certifique-se de que a origem do front-end está configurada no servidor Socket. " +
            `Origem atual: ${window.location.origin}`
        );
      }
      setIsSessionConnected(false);
    });

    // Configurar listeners para eventos do servidor
    socket.on("session_event", (data) => {
      console.log("📨 Evento de sessão recebido:", data);
    });

    socket.on("heartbeat", (data) => {
      console.log("💓 Heartbeat recebido:", data);
    });

    // Reconfigurar listeners após reconexão
    socket.on("reconnect", () => {
      console.log("🔄 Reconectado ao namespace /session");
      setIsSessionConnected(true);
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

    // Se já existe um socket desconectado, limpar antes de criar um novo
    if (onlineStatusSocket) {
      onlineStatusSocket.removeAllListeners();
      onlineStatusSocket.disconnect();
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
      if (
        error.message.includes("CORS") ||
        error.message.includes("xhr poll error")
      ) {
        console.error(
          "⚠️ Erro de CORS detectado. " +
            "Certifique-se de que a origem do front-end está configurada no servidor Socket. " +
            `Origem atual: ${window.location.origin}`
        );
      }
      setIsOnlineStatusConnected(false);
    });

    // Configurar listeners para eventos do servidor
    socket.on("online_status_update", (data: OnlineStatusUpdate) => {
      console.log("📨 Atualização de status online recebida:", data);
      const currentUser = userRef.current;
      if (currentUser && isMaster(currentUser)) {
        const colab = currentUser.colabs?.[data.user_pin];
        if (colab) {
          const notificationData: OnlineStatusNotificationData = {
            type: "online_status",
            colab,
            online: data.is_online,
          };
          dispatch(updateColab({ ...colab, is_online: data.is_online }));
          showNotification(notificationData);
        }
      }
    });

    socket.on("presence_heartbeat", (data) => {
      console.log("💓 Presence heartbeat recebido:", data);
    });

    socket.on("status_subscription_confirmed", (data) => {
      console.log("✅ Inscrição de status confirmada:", data);
    });

    // Reconfigurar listeners após reconexão
    socket.on("reconnect", () => {
      console.log("🔄 Reconectado ao namespace /online-status");
      setIsOnlineStatusConnected(true);
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
