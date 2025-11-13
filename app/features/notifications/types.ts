import type { IColab } from "~/features/user/typings/Colab";

/**
 * Tipos de notificações suportadas
 */
export type NotificationType = "online_status";

/**
 * Props para notificação de status online
 */
export interface OnlineStatusNotificationData {
  type: "online_status";
  colab: IColab | null;
  online: boolean;
}

/**
 * Union type para todos os tipos de dados de notificação
 */
export type NotificationData = OnlineStatusNotificationData;
