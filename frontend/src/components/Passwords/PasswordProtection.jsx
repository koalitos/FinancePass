import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const PasswordProtection = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  useEffect(() => {
    if (isLocked && lockTimer > 0) {
      const timer = setTimeout(() => {
        setLockTimer(lockTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isLocked && lockTimer === 0) {
      setIsLocked(false);
      setAttempts(0);
    }
  }, [isLocked, lockTimer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Aguarde ${lockTimer} segundos antes de tentar novamente`);
      return;
    }

    // Validar senha localmente
    const savedPassword = localStorage.getItem('masterPassword');
    const hashedPassword = btoa(password);
    
    if (savedPassword === hashedPassword) {
      onUnlock();
      setError('');
      setAttempts(0);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockTimer(30);
        setError('Muitas tentativas incorretas. Aguarde 30 segundos.');
      } else {
        setError(`Senha incorreta. ${3 - newAttempts} tentativa(s) restante(s).`);
      }
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-8 text-white text-center">
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-2">🔐 Área Protegida</h2>
          <p className="text-blue-100">Digite a senha da sua conta para acessar</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-card rounded-b-xl shadow-2xl p-8 border border-dark-border">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-dark-text mb-2">
              🔑 Senha de Acesso
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked}
                className={`w-full px-4 py-3 pr-12 bg-dark-bg border-2 text-dark-text rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  error ? 'border-red-500 focus:ring-red-500' : 'border-dark-border focus:ring-blue-500 focus:border-blue-500'
                } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Digite sua senha"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-muted hover:text-dark-text transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </p>
            )}
          </div>

          {isLocked && (
            <div className="mb-6 p-4 bg-red-900/20 border-2 border-red-500/50 rounded-lg">
              <p className="text-red-400 text-center font-semibold">
                ⏱️ Bloqueado por {lockTimer} segundos
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLocked || !password}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              isLocked || !password
                ? 'bg-dark-border text-dark-muted cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {isLocked ? '🔒 Bloqueado' : '🔓 Desbloquear'}
          </button>

          <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border-2 border-blue-500/30">
            <p className="text-sm text-blue-300 text-center font-medium">
              💡 Use a <strong>mesma senha do seu login</strong>
            </p>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < attempts ? 'bg-red-500' : 'bg-dark-border'
                }`}
              />
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-dark-border text-center">
            <p className="text-sm text-dark-muted mb-3">Esqueceu sua senha?</p>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('⚠️ ATENÇÃO!\n\nIsso irá:\n• Desconectar você\n• Apagar TODOS os dados locais\n• Você precisará criar uma nova conta\n\nDeseja continuar?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="text-sm text-red-500 hover:text-red-400 underline transition-colors font-semibold"
            >
              🔄 Resetar Tudo e Criar Nova Conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordProtection;
