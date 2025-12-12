import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClient configurado com otimizações de performance
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tempo que os dados são considerados "frescos" (não precisam refetch)
      // 5 minutos: bom equilíbrio entre performance e dados atualizados
      staleTime: 1000 * 60 * 5,
      
      // Tempo que os dados inativos permanecem em cache antes de garbage collection
      // 10 minutos: permite navegação rápida sem perder cache útil
      gcTime: 1000 * 60 * 10, // Antigo cacheTime
      
      // Retry automático reduzido para melhorar UX em caso de erro
      retry: 1,
      
      // Não refetch automático ao focar a janela (melhor performance mobile)
      refetchOnWindowFocus: false,
      
      // Não refetch ao reconectar (evita requisições desnecessárias)
      refetchOnReconnect: false,
      
      // Não refetch ao montar se dados já estão frescos
      refetchOnMount: false,
    },
    mutations: {
      // Retry reduzido para mutations (erros são mais críticos)
      retry: 1,
    },
  },
});

