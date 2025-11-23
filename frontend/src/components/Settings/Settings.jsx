import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { useTranslation } from 'react-i18next';
import { 
  Wallet, 
  Lock, 
  Users, 
  CreditCard, 
  Receipt,
  Settings as SettingsIcon,
  RotateCcw,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Settings = () => {
  const { settings, updateModules, resetSettings } = useSettings();
  const { t } = useTranslation();

  const modules = [
    {
      id: 'finance',
      name: 'Controle Financeiro',
      description: 'Receitas, despesas e parcelamentos',
      icon: Wallet,
      color: 'text-green-500'
    },
    {
      id: 'passwords',
      name: 'Gerenciador de Senhas',
      description: 'Armazene senhas com segurança',
      icon: Lock,
      color: 'text-blue-500'
    },
    {
      id: 'debts',
      name: 'Gestão de Dívidas',
      description: 'Controle quem te deve e quem você deve',
      icon: CreditCard,
      color: 'text-orange-500'
    },
    {
      id: 'bills',
      name: 'Contas Recorrentes',
      description: 'Contas fixas mensais',
      icon: Receipt,
      color: 'text-purple-500'
    },
    {
      id: 'people',
      name: 'Cadastro de Pessoas',
      description: 'Gerencie contatos e transações',
      icon: Users,
      color: 'text-indigo-500'
    }
  ];

  const handleToggleModule = (moduleId) => {
    updateModules({
      [moduleId]: !settings.modules[moduleId]
    });
  };

  const handleReset = () => {
    if (window.confirm('Deseja restaurar as configurações padrão? Todos os módulos serão ativados.')) {
      resetSettings();
    }
  };

  const activeCount = Object.values(settings.modules).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Configurações</h1>
            <p className="text-dark-muted">Personalize os módulos do aplicativo</p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="card mb-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Módulos Ativos: {activeCount} de {modules.length}</h3>
            <p className="text-sm text-dark-muted">
              Ative apenas os módulos que você precisa para uma experiência mais focada.
              As configurações são salvas automaticamente.
            </p>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = settings.modules[module.id];

          return (
            <div
              key={module.id}
              className={`card cursor-pointer transition-all ${
                isActive 
                  ? 'border-indigo-500/50 bg-indigo-500/5' 
                  : 'border-dark-border opacity-60 hover:opacity-100'
              }`}
              onClick={() => handleToggleModule(module.id)}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isActive ? 'bg-indigo-500/10' : 'bg-dark-bg'
                }`}>
                  <Icon className={`w-6 h-6 ${isActive ? module.color : 'text-dark-muted'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{module.name}</h3>
                    {isActive ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-dark-muted flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-dark-muted">{module.description}</p>
                </div>
              </div>

              {/* Toggle Indicator */}
              <div className="mt-4 pt-4 border-t border-dark-border">
                <div className="flex items-center justify-between text-sm">
                  <span className={isActive ? 'text-green-500 font-medium' : 'text-dark-muted'}>
                    {isActive ? 'Ativo' : 'Desativado'}
                  </span>
                  <span className="text-xs text-dark-muted">Clique para alternar</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Restaurar Padrões</h3>
            <p className="text-sm text-dark-muted">
              Ativar todos os módulos e restaurar configurações originais
            </p>
          </div>
          <button
            onClick={handleReset}
            className="btn-secondary flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Restaurar
          </button>
        </div>
      </div>

      {/* Warning */}
      {activeCount === 0 && (
        <div className="card mt-6 bg-red-500/10 border-red-500/20">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-500 mb-1">Atenção!</h3>
              <p className="text-sm text-dark-muted">
                Você desativou todos os módulos. Ative pelo menos um para usar o aplicativo.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
