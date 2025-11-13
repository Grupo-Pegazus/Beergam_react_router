import type { IColab } from "~/features/user/typings/Colab";

/**
 * Tipos de notificações suportadas
 */
export type NotificationType = "online_status" | "custom";

/**
 * Props para notificação de status online
 */
export interface OnlineStatusNotificationData {
  type: "online_status";
  colab: IColab | null;
  online: boolean;
}

/**
 * Props para notificação customizada
 */
export interface CustomNotificationData {
  type: "custom";
  content: React.ReactElement;
  icon?: React.ReactElement;
}

/**
 * Union type para todos os tipos de dados de notificação
 */
export type NotificationData =
  | OnlineStatusNotificationData
  | CustomNotificationData;
