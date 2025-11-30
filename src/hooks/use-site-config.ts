"use client";

import { useState, useEffect, useCallback } from 'react';

interface SiteConfig {
  siteName?: string;
  siteLogo?: string;
}

// Cache em memória para evitar flash de conteúdo antigo
let cachedConfig: SiteConfig | null = null;
let configPromise: Promise<SiteConfig> | null = null;

export function useSiteConfig() {
  // Inicializar com cache se disponível
  const [config, setConfig] = useState<SiteConfig>(() => {
    // Usar cache se disponível, senão usar valores padrão sem logo
    return cachedConfig || {
      siteName: 'VAQ APP',
      siteLogo: undefined,
    };
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  const fetchConfig = useCallback(async (): Promise<SiteConfig> => {
    // Limpar promise anterior se houver
    configPromise = null;

    console.log('🚀 Iniciando fetchConfig...');
    configPromise = (async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('📡 Fazendo fetch para /api/site-config...');

        // Adicionar timestamp para evitar cache do navegador
        const res = await fetch(`/api/site-config?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        });
        
        console.log('📡 Resposta recebida, status:', res.status, 'ok:', res.ok);
        
        if (!res.ok) {
          throw new Error('Erro ao buscar configurações');
        }
        
        const data = await res.json();
        console.log('📥 API retornou RAW:', JSON.stringify(data, null, 2));
        
        // A API retorna { siteLogo: "...", siteName: "..." } diretamente
        // Se não existir, usar valores padrão
        const newConfig = {
          siteName: data.siteName || 'VAQ APP',
          siteLogo: data.siteLogo && data.siteLogo.trim() !== '' ? data.siteLogo : undefined,
        };
        
        console.log('📦 Config processado:', newConfig);
        
        // Limpar cache anterior e atualizar com novo valor
        cachedConfig = newConfig;
        
        console.log('✅ Estado sendo atualizado:', {
          'newConfig.siteLogo': newConfig.siteLogo,
          'newConfig.siteName': newConfig.siteName,
        });
        
        // Atualizar loading ANTES de atualizar o config
        setLoading(false);
        
        // Forçar atualização usando setState com função para garantir que React detecte a mudança
        setConfig((prev) => {
          const isDifferent = prev.siteLogo !== newConfig.siteLogo || prev.siteName !== newConfig.siteName;
          console.log('✅ setConfig executado:', {
            'prev.siteLogo': prev.siteLogo,
            'newConfig.siteLogo': newConfig.siteLogo,
            'vão ser diferentes?': isDifferent
          });
          // Sempre retornar novo objeto para forçar re-render
          return {
            siteName: newConfig.siteName,
            siteLogo: newConfig.siteLogo,
          };
        });
        
        return newConfig;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        
        // Usar cache se disponível em caso de erro
        if (cachedConfig) {
          return cachedConfig;
        }
        
        // Valores padrão apenas se não houver cache
        const defaultConfig = {
          siteName: 'VAQ APP',
          siteLogo: undefined,
        };
        return defaultConfig;
      } finally {
        // setLoading(false) já foi chamado antes do setConfig
        configPromise = null;
      }
    })();

    return configPromise;
  }, []);

  useEffect(() => {
    // Buscar configurações imediatamente
    fetchConfig();
    
    // Escutar eventos de atualização de configuração
    const handleConfigUpdate = () => {
      fetchConfig();
    };
    
    // Escutar eventos normais
    window.addEventListener('site-config-updated', handleConfigUpdate);
    
    // Escutar BroadcastChannel para atualizações entre abas
    let broadcastChannel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      broadcastChannel = new BroadcastChannel('site-config-updates');
      broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'config-updated') {
          fetchConfig();
        }
      };
    }
    
    return () => {
      window.removeEventListener('site-config-updated', handleConfigUpdate);
      if (broadcastChannel) {
        broadcastChannel.close();
      }
    };
  }, [fetchConfig]);

  return { config, loading, error, refresh: fetchConfig };
}


