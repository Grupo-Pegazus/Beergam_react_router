import { useEffect, useCallback } from "react";
import type { Socket } from "socket.io-client";
import { useSocketContext } from "../context/SocketContext";
import type {
  SessionEvent,
  SessionStatus,
  TokenValidation,
  HeartbeatData,
  TeamStatus,
  UserStatus,
  OnlineStatusUpdate,
  StatusSubscription,
  PresenceHeartbeat,
} from "../typings/socket.types";

/**
 * Hook para facilitar o uso do socket nos componentes
 */
export function useSocket() {
  const context = useSocketContext();

  /**
   * Métodos para o namespace /session
   */
  const session = {
    /**
     * Obter status da sessão
     */
    getStatus: useCallback(
      (callback?: (status: SessionStatus) => void) => {
        if (context.sessionSocket?.connected) {
          context.sessionSocket.emit("get_session_status", callback);
        } else {
          console.warn("Socket /session não está conectado");
        }
      },
      [context.sessionSocket]
    ),

    /**
     * Validar token
     */
    validateToken: useCallback(
      (data: unknown, callback?: (validation: TokenValidation) => void) => {
        if (context.sessionSocket?.connected) {
          context.sessionSocket.emit("validate_token", data, callback);
        } else {
          console.warn("Socket /session não está conectado");
        }
      },
      [context.sessionSocket]
    ),

    /**
     * Configurar heartbeat
     */
    setHeartbeat: useCallback(
      (interval: number = 30000) => {
        if (context.sessionSocket?.connected) {
          context.sessionSocket.emit("set_heartbeat", { interval });
        } else {
          console.warn("Socket /session não está conectado");
        }
      },
      [context.sessionSocket]
    ),

    /**
     * Enviar heartbeat manual
     */
    sendHeartbeat: useCallback(() => {
      if (context.sessionSocket?.connected) {
        context.sessionSocket.emit("session_heartbeat");
      } else {
        console.warn("Socket /session não está conectado");
      }
    }, [context.sessionSocket]),

    /**
     * Escutar eventos de sessão
     */
    onSessionEvent: useCallback(
      (callback: (data: SessionEvent) => void) => {
        if (context.sessionSocket) {
          context.sessionSocket.on("session_event", callback);
          return () => {
            context.sessionSocket?.off("session_event", callback);
          };
        }
        return () => {};
      },
      [context.sessionSocket]
    ),

    /**
     * Escutar heartbeats
     */
    onHeartbeat: useCallback(
      (callback: (data: HeartbeatData) => void) => {
        if (context.sessionSocket) {
          context.sessionSocket.on("heartbeat", callback);
          return () => {
            context.sessionSocket?.off("heartbeat", callback);
          };
        }
        return () => {};
      },
      [context.sessionSocket]
    ),
  };

  /**
   * Métodos para o namespace /online-status
   */
  const onlineStatus = {
    /**
     * Obter status do time
     */
    getTeamStatus: useCallback(
      (callback?: (status: TeamStatus) => void) => {
        if (context.onlineStatusSocket?.connected) {
          context.onlineStatusSocket.emit("get_team_status", callback);
        } else {
          console.warn("Socket /online-status não está conectado");
        }
      },
      [context.onlineStatusSocket]
    ),

    /**
     * Obter status de um usuário específico
     */
    getUserStatus: useCallback(
      (
        userPin: string,
        callback?: (status: UserStatus) => void
      ) => {
        if (context.onlineStatusSocket?.connected) {
          context.onlineStatusSocket.emit(
            "get_user_status",
            { user_pin: userPin },
            callback
          );
        } else {
          console.warn("Socket /online-status não está conectado");
        }
      },
      [context.onlineStatusSocket]
    ),

    /**
     * Inscrever-se em atualizações de status
     */
    subscribeStatusUpdates: useCallback(
      (userPins: string[]) => {
        if (context.onlineStatusSocket?.connected) {
          context.onlineStatusSocket.emit("subscribe_status_updates", {
            user_pins: userPins,
          });
        } else {
          console.warn("Socket /online-status não está conectado");
        }
      },
      [context.onlineStatusSocket]
    ),

    /**
     * Configurar heartbeat de presença
     */
    setPresenceHeartbeat: useCallback(
      (interval: number = 30000) => {
        if (context.onlineStatusSocket?.connected) {
          context.onlineStatusSocket.emit("set_presence_heartbeat", {
            interval,
          });
        } else {
          console.warn("Socket /online-status não está conectado");
        }
      },
      [context.onlineStatusSocket]
    ),

    /**
     * Escutar atualizações de status online
     */
    onStatusUpdate: useCallback(
      (callback: (data: OnlineStatusUpdate) => void) => {
        if (context.onlineStatusSocket) {
          context.onlineStatusSocket.on("online_status_update", callback);
          return () => {
            context.onlineStatusSocket?.off("online_status_update", callback);
          };
        }
        return () => {};
      },
      [context.onlineStatusSocket]
    ),

    /**
     * Escutar confirmação de inscrição
     */
    onSubscriptionConfirmed: useCallback(
      (callback: (data: StatusSubscription) => void) => {
        if (context.onlineStatusSocket) {
          context.onlineStatusSocket.on(
            "status_subscription_confirmed",
            callback
          );
          return () => {
            context.onlineStatusSocket?.off(
              "status_subscription_confirmed",
              callback
            );
          };
        }
        return () => {};
      },
      [context.onlineStatusSocket]
    ),

    /**
     * Escutar heartbeats de presença
     */
    onPresenceHeartbeat: useCallback(
      (callback: (data: PresenceHeartbeat) => void) => {
        if (context.onlineStatusSocket) {
          context.onlineStatusSocket.on("presence_heartbeat", callback);
          return () => {
            context.onlineStatusSocket?.off("presence_heartbeat", callback);
          };
        }
        return () => {};
      },
      [context.onlineStatusSocket]
    ),
  };

  return {
    // Estado das conexões
    isSessionConnected: context.isSessionConnected,
    isOnlineStatusConnected: context.isOnlineStatusConnected,
    
    // Sockets diretos (para uso avançado)
    sessionSocket: context.sessionSocket,
    onlineStatusSocket: context.onlineStatusSocket,
    
    // Métodos do namespace /session
    session,
    
    // Métodos do namespace /online-status
    onlineStatus,
    
    // Métodos de controle
    connectSession: context.connectSession,
    connectOnlineStatus: context.connectOnlineStatus,
    disconnectSession: context.disconnectSession,
    disconnectOnlineStatus: context.disconnectOnlineStatus,
    disconnectAll: context.disconnectAll,
    isConnected: context.isConnected,
  };
}

