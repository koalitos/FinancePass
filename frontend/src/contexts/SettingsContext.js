import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    // Carregar configurações do localStorage
    const saved = localStorage.getItem('app-settings');
    if (saved) {
      return JSON.parse(saved);
    }
    // Configurações padrão - todos os módulos ativos
    return {
      modules: {
        finance: true,      // Controle financeiro
        passwords: true,    // Gerenciador de senhas
        debts: true,        // Gestão de dívidas
        bills: true,        // Contas recorrentes
        people: true        // Cadastro de pessoas
      },
      theme: 'dark',
      language: 'pt-BR'
    };
  });

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
  }, [settings]);

  const updateModules = (modules) => {
    setSettings(prev => ({
      ...prev,
      modules: { ...prev.modules, ...modules }
    }));
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const resetSettings = () => {
    const defaultSettings = {
      modules: {
        finance: true,
        passwords: true,
        debts: true,
        bills: true,
        people: true
      },
      theme: 'dark',
      language: 'pt-BR'
    };
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateModules, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
