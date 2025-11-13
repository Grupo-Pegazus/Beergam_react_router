import { Box, Chip, Paper, Typography } from "@mui/material";
import { useSocketContext } from "../context/SocketContext";

/**
 * Componente que exibe o status das conexões Socket.IO
 * Visível em todas as páginas através do root.tsx
 */
export function SocketStatusIndicator() {
  const {
    isSessionConnected,
    isOnlineStatusConnected,
    sessionSocket,
    onlineStatusSocket,
  } = useSocketContext();

  const sessionId = sessionSocket?.id || "N/A";
  const onlineStatusId = onlineStatusSocket?.id || "N/A";

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        padding: 2,
        minWidth: 280,
        zIndex: 9999,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1.5, fontSize: "0.95rem" }}>
        🔌 Status Socket.IO
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {/* Status /session */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Chip
              label={isSessionConnected ? "Conectado" : "Desconectado"}
              color={isSessionConnected ? "success" : "error"}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              /session
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "text.secondary", ml: 1 }}>
            ID: {sessionId}
          </Typography>
        </Box>

        {/* Status /online-status */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Chip
              label={isOnlineStatusConnected ? "Conectado" : "Desconectado"}
              color={isOnlineStatusConnected ? "success" : "error"}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              /online-status
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "text.secondary", ml: 1 }}>
            ID: {onlineStatusId}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

