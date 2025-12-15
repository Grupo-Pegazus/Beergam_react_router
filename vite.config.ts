import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { sentryReactRouter, type SentryReactRouterBuildOptions } from '@sentry/react-router';

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "beergam",
  project: "beergam-frontend",
  // An auth token is required for uploading source maps;
  // store it in an environment variable to keep it secure.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // ...
};

// @ts-expect-error - defineConfig aceita async functions mas o tipo não está correto
export default defineConfig(async (config) => {
  const plugins = [tailwindcss(), reactRouter(), tsconfigPaths()];

  if (process.env.NODE_ENV === 'production') {
    const sentryPlugins = await sentryReactRouter(sentryConfig, config);

    // sla, as vezes o sentry retornava um único plugin, outras vezes um array, entendi foi nada
    if (Array.isArray(sentryPlugins)) {
      plugins.push(...sentryPlugins);
    } else if (sentryPlugins) {
      plugins.push(sentryPlugins);
    }
  }

  return {
    plugins,
    ssr: {
      noExternal: ["gsap", "@marsidev/react-turnstile"]
    },
    build: {
      target: 'esnext',

      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (id.includes('react-router')) {
              return 'react-router';
            }
            
            if (id.includes('react-dom')) {
              return 'react-dom';
            }
            
            if (id.includes('react/') && !id.includes('react-dom')) {
              return 'react';
            }
            
            // MUI - biblioteca grande, separa em chunk próprio
            if (id.includes('@mui/material') || id.includes('@mui/icons-material')) {
              return 'mui';
            }
            
            // TanStack Query - biblioteca grande usada em muitos lugares
            if (id.includes('@tanstack/react-query')) {
              return 'react-query';
            }
            
            // Zustand - state management
            if (id.includes('zustand')) {
              return 'zustand';
            }
            
            // Bibliotecas de animação
            if (id.includes('gsap') || id.includes('@gsap')) {
              return 'animations';
            }
            
            // Partículas
            if (id.includes('tsparticles')) {
              return 'particles';
            }
            
            // Charts
            if (id.includes('recharts') || id.includes('react-simple-maps')) {
              return 'charts';
            }
            
            // Stripe - carregar apenas quando necessário
            if (id.includes('@stripe')) {
              return 'stripe';
            }
            
            // Formulários
            if (id.includes('react-hook-form') || id.includes('@hookform')) {
              return 'forms';
            }
            
            // Axios e HTTP clients
            if (id.includes('axios')) {
              return 'axios';
            }
            
            // Socket.io
            if (id.includes('socket.io')) {
              return 'socket';
            }
            
            // Outras dependências vendor
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            
            // Retorna undefined para arquivos do projeto (não node_modules)
            return undefined;
          },
        },
      },

      chunkSizeWarningLimit: 1000,
      
      minify: 'esbuild',
      
      // Source maps apenas em desenvolvimento (melhor segurança em produção)
      // Em produção, source maps são gerados pelo Sentry plugin para debugging remoto
      sourcemap: config.mode === 'development',
      
      cssCodeSplit: true,
      cssMinify: true,
    },
    
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router',
        '@mui/material',
        '@tanstack/react-query',
        'zustand',
      ],
      exclude: ['@tsparticles/all'],
    },
  };
});