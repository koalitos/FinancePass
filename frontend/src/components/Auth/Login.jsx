import React, { useState } from 'react';
import { Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { APP_VERSION } from '../../config/version';

const Login = ({ onLogin, isFirstAccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const generatePassword = () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    setConfirmPassword(newPassword);
    setShowPassword(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isFirstAccess) {
        // Validar confirmação de senha
        if (password !== confirmPassword) {
          setError('As senhas não coincidem!');
          setLoading(false);
          return;
        }
        
        if (password.length < 4) {
          setError('A senha deve ter pelo menos 4 caracteres!');
          setLoading(false);
          return;
        }

        // Salvar senha localmente (hash simples)
        const hashedPassword = btoa(password); // Base64 encoding
        localStorage.setItem('masterPassword', hashedPassword);
        localStorage.setItem('user', JSON.stringify({ username: 'user', name: 'Usuário' }));
        onLogin({ username: 'user', name: 'Usuário' });
      } else {
        // Verificar senha localmente
        const savedPassword = localStorage.getItem('masterPassword');
        const hashedPassword = btoa(password);
        
        if (savedPassword === hashedPassword) {
          const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
          const userData = { username: 'user', name: savedUser.name || 'Usuário' };
          localStorage.setItem('user', JSON.stringify(userData));
          onLogin(userData);
        } else {
          setError('Senha incorreta!');
          setLoading(false);
        }
      }
    } catch (err) {
      setError('Erro ao processar senha!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-3xl mb-6 shadow-2xl transform hover:scale-105 transition-transform">
            <span className="text-5xl">💰</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            FinancePass
          </h1>
          <p className="text-dark-muted text-lg">
            {isFirstAccess ? '✨ Crie sua conta para começar' : '👋 Bem-vindo de volta!'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-dark-card rounded-2xl shadow-2xl border-2 border-dark-border overflow-hidden backdrop-blur-sm">
          <div className="bg-gradient-to-r from-primary/20 to-blue-600/20 p-6 border-b-2 border-dark-border">
            <h2 className="text-xl font-bold text-white text-center">
              {isFirstAccess ? '🎉 Primeiro Acesso' : '🔐 Login'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-dark-text">
                  🔑 {isFirstAccess ? 'Crie sua Senha Mestra' : 'Senha Mestra'}
                </label>
                {isFirstAccess && (
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-all text-xs font-semibold"
                  >
                    <RefreshCw size={14} />
                    Gerar Senha
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-muted" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder={isFirstAccess ? 'Crie uma senha forte' : 'Digite sua senha mestra'}
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isFirstAccess && (
              <div>
                <label className="block text-sm font-semibold text-dark-text mb-2">🔒 Confirme a Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-muted" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Digite a senha novamente"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-900/30 border-2 border-red-500/50 rounded-xl text-red-400 text-sm flex items-start gap-3 animate-shake">
                <span className="text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform ${
                loading 
                  ? 'bg-dark-border text-dark-muted cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Carregando...
                </span>
              ) : (
                <span>{isFirstAccess ? '✨ Criar Conta' : '🚀 Entrar'}</span>
              )}
            </button>
          </form>

          {isFirstAccess && (
            <div className="mx-8 mb-8 p-4 bg-gradient-to-r from-primary/10 to-blue-600/10 border-2 border-primary/30 rounded-xl">
              <p className="text-primary font-bold mb-2 flex items-center gap-2">
                <span className="text-xl">🎉</span>
                Primeira Configuração!
              </p>
              <p className="text-dark-muted text-sm leading-relaxed">
                Crie uma senha mestra forte. Ela será usada para proteger todos os seus dados. 
                <strong className="text-warning block mt-1">⚠️ Não esqueça esta senha!</strong>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <div className="flex items-center justify-center gap-2 text-dark-muted text-sm">
            <Lock size={16} />
            <p>Seus dados são armazenados localmente</p>
          </div>
          <p className="text-dark-muted/60 text-xs">Versão {APP_VERSION}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
