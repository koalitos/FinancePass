import React, { useState } from 'react';
import { Smartphone, Rocket, Code, Zap, Settings } from 'lucide-react';
import MobileSync from './MobileSync';

const SyncManager = () => {
  const [showDevMode, setShowDevMode] = useState(false);

  if (showDevMode) {
    return (
      <div>
        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={() => setShowDevMode(false)}
            className="flex items-center gap-2 px-4 py-2 bg-dark-border text-dark-text rounded-lg hover:bg-dark-border/70 transition-all"
          >
            ← Voltar para "Em Breve"
          </button>
          <span className="text-xs text-warning bg-warning/10 px-3 py-1 rounded-full border border-warning/30">
            🔧 Modo Desenvolvedor
          </span>
        </div>
        <MobileSync />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Smartphone className="text-primary" size={32} />
          Sincronização Mobile
        </h1>
        <p className="text-dark-muted mt-1">Sincronize seus dados com o aplicativo móvel</p>
      </div>

      {/* Banner Em Breve */}
      <div className="card bg-gradient-to-br from-primary/10 via-blue-600/10 to-purple-600/10 border-2 border-primary/30 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center py-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-3xl mb-6 shadow-2xl animate-pulse">
            <Rocket className="text-white" size={48} />
          </div>
          
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Em Breve! 🚀
          </h2>
          
          <p className="text-lg text-dark-text mb-6 max-w-2xl mx-auto">
            Estamos desenvolvendo o <strong className="text-primary">aplicativo móvel</strong> para você acessar seus dados em qualquer lugar!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
            <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-xl p-6">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Smartphone size={24} className="text-primary" />
              </div>
              <h3 className="font-bold mb-2">App Nativo</h3>
              <p className="text-sm text-dark-muted">
                Aplicativo para Android e iOS com interface otimizada
              </p>
            </div>

            <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-xl p-6">
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap size={24} className="text-success" />
              </div>
              <h3 className="font-bold mb-2">Sincronização</h3>
              <p className="text-sm text-dark-muted">
                Dados sincronizados em tempo real entre dispositivos
              </p>
            </div>

            <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Code size={24} className="text-blue-500" />
              </div>
              <h3 className="font-bold mb-2">Em Desenvolvimento</h3>
              <p className="text-sm text-dark-muted">
                Trabalhando duro para trazer a melhor experiência
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl max-w-2xl mx-auto">
            <p className="text-sm text-dark-muted">
              <strong className="text-primary">💡 Enquanto isso:</strong> Use o sistema de <strong>Backup</strong> para proteger seus dados e transferi-los entre dispositivos manualmente.
            </p>
          </div>

          {/* Botão Desenvolvedor (escondido) */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowDevMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-dark-border/50 text-dark-muted rounded-lg hover:bg-dark-border hover:text-dark-text transition-all text-xs"
              title="Modo desenvolvedor - Ver implementação atual"
            >
              <Settings size={14} />
              Ver Implementação Atual (Dev)
            </button>
          </div>
        </div>
      </div>

      {/* Recursos Planejados */}
      <div className="mt-6 card">
        <h3 className="text-xl font-bold mb-4">📋 Recursos Planejados</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-dark-bg rounded-lg">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-xs">✓</span>
            </div>
            <div>
              <p className="font-semibold">Acesso Offline</p>
              <p className="text-sm text-dark-muted">Visualize e edite dados mesmo sem internet</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-dark-bg rounded-lg">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-xs">✓</span>
            </div>
            <div>
              <p className="font-semibold">Notificações Push</p>
              <p className="text-sm text-dark-muted">Alertas de contas a vencer e lembretes</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-dark-bg rounded-lg">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-xs">✓</span>
            </div>
            <div>
              <p className="font-semibold">Widgets</p>
              <p className="text-sm text-dark-muted">Visualize resumos direto na tela inicial</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-dark-bg rounded-lg">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-xs">✓</span>
            </div>
            <div>
              <p className="font-semibold">Biometria</p>
              <p className="text-sm text-dark-muted">Desbloqueio rápido com impressão digital ou Face ID</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncManager;
