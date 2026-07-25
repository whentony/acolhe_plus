import React, { useState } from 'react';
import { Mail, Lock, Info } from 'lucide-react';
import AboutProject from './AboutProject';
import './Login.css';

const Login = ({ onLogin, onSwitchMode }) => {
  const [email, setEmail] = useState('usuario@trans.org');
  const [password, setPassword] = useState('acolhimento123');
  const [isLoading, setIsLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de delay de rede para autenticação (Mock)
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        name: 'Usuário',
        email: email,
        identity: 'Mulher Trans'
      });
    }, 1500);
  };

  if (showAbout) {
    return (
      <div className="login-container" style={{ background: 'var(--bg-dark)', alignItems: 'stretch' }}>
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', height: '100vh' }}>
          <AboutProject onBack={() => setShowAbout(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-bg-glow"></div>
      
      <div className="login-card glass-panel animate-fade-in">
        <div className="login-header">
          <h1>Acolhe<span>+</span></h1>
          <p>Faça login para mapear locais seguros</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              placeholder="Seu e-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              placeholder="Sua senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-options">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="checkbox" /> Lembrar de mim
            </label>
            <a href="#forgot">Esqueceu a senha?</a>
          </div>

          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? 'Autenticando...' : 'Entrar na Plataforma'}
          </button>
        </form>

        <div className="login-footer">
          Ainda não tem uma conta? 
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchMode(); }}>Cadastre-se</a>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
          <button 
            onClick={() => setShowAbout(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Info size={16} /> Saiba mais sobre o projeto
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
