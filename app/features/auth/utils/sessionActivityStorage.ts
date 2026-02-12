const STORAGE_KEY = "beergam_session_last_activity";

export function getLastActivity(): number | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? parseInt(stored, 10) : null;
    return parsed && !Number.isNaN(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function setLastActivity(timestamp: number = Date.now()): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(timestamp));
  } catch {
    console.error("Erro ao armazenar a última atividade da sessão");
  }
}
