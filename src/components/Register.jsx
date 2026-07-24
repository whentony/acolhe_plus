import React, { useState } from 'react';
import { Heart, Shield } from 'lucide-react';
import './Register.css';

const isValidCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  
  let soma = 0;
  let resto;
  
  for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  
  soma = 0;
  for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
};

const Register = ({ onComplete, onSwitchMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    identity: '',
    orientation: '',
    race: '',
    pronouns: '',
  });
  const [cpfError, setCpfError] = useState('');
  const [showConsentModal, setShowConsentModal] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    if (name === 'cpf') {
      setCpfError(''); // Limpa o erro ao digitar
      value = value
        .replace(/\D/g, '') 
        .replace(/(\d{3})(\d)/, '$1.$2') 
        .replace(/(\d{3})(\d)/, '$1.$2') 
        .replace(/(\d{3})(\d{1,2})/, '$1-$2') 
        .replace(/(-\d{2})\d+?$/, '$1'); 
        
      // Validação em tempo real ao terminar de digitar
      if (value.length === 14) {
        if (!isValidCPF(value)) {
          setCpfError('CPF inválido.');
        }
      }
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.cpf) {
      if (!isValidCPF(formData.cpf)) {
        setCpfError('CPF inválido. Por favor, verifique os números digitados.');
        return;
      }
      setShowConsentModal(true);
    }
  };

  const handleConfirmConsent = () => {
    onComplete(formData);
  };

  return (
    <div className="register-container animate-fade-in">
      <div className="register-card glass-panel">
        <div className="register-header">
          <Heart size={48} color="#ec4899" fill="#ec4899" className="mb-4" />
          <h1>Acolhe<span>+</span></h1>
          <p>Junte-se à nossa comunidade para mapearmos o acolhimento no Brasil inteiro.</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Como gostaria de ser chamade? (Nome Social)</label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="Seu nome"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>CPF</label>
            <input 
              type="text" 
              name="cpf" 
              required 
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleChange}
              className={`form-input ${cpfError ? 'input-error' : ''}`}
              style={cpfError ? { border: '2px solid #ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', outline: 'none' } : {}}
            />
            {cpfError && <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px', fontWeight: 600 }}>{cpfError}</span>}
          </div>

          <div className="form-group">
            <label>Identidade de Gênero</label>
            <select name="identity" value={formData.identity} onChange={handleChange} className="form-input" required>
              <option value="" disabled>Selecione uma opção</option>
              <option value="Mulher Trans">Mulher Trans</option>
              <option value="Homem Trans">Homem Trans</option>
              <option value="Travesti">Travesti</option>
              <option value="Não-Binário">Não-Binário</option>
              <option value="Mulher Cis">Mulher Cis</option>
              <option value="Homem Cis">Homem Cis</option>
              <option value="Prefiro não informar">Prefiro não informar</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label>Pronomes</label>
            <select name="pronouns" value={formData.pronouns} onChange={handleChange} className="form-input" required>
              <option value="" disabled>Selecione uma opção</option>
              <option value="Ela/Dela">Ela / Dela</option>
              <option value="Ele/Dele">Ele / Dele</option>
              <option value="Elu/Delu">Elu / Delu</option>
              <option value="Prefiro não informar">Prefiro não informar</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label>Orientação Sexual</label>
            <select name="orientation" value={formData.orientation} onChange={handleChange} className="form-input" required>
              <option value="" disabled>Selecione uma opção</option>
              <option value="Lésbica">Lésbica</option>
              <option value="Gay">Gay</option>
              <option value="Bissexual">Bissexual</option>
              <option value="Pansexual">Pansexual</option>
              <option value="Assexual">Assexual</option>
              <option value="Heterossexual">Heterossexual</option>
              <option value="Prefiro não informar">Prefiro não informar</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label>Raça / Cor</label>
            <select name="race" value={formData.race} onChange={handleChange} className="form-input" required>
              <option value="" disabled>Selecione uma opção</option>
              <option value="Preta">Preta</option>
              <option value="Parda">Parda</option>
              <option value="Branca">Branca</option>
              <option value="Indígena">Indígena</option>
              <option value="Amarela">Amarela (Ascendência Asiática)</option>
              <option value="Prefiro não informar">Prefiro não informar</option>
            </select>
          </div>

          <button type="submit" className="submit-btn register-submit">
            Cadastrar
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Já possui uma conta? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchMode(); }} style={{ color: '#5bcefa', textDecoration: 'none', fontWeight: 600 }}>Faça Login</a>
          </div>
        </form>
      </div>

      {showConsentModal && (
        <div className="animate-fade-in" style={{ zIndex: 1000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Shield size={48} color="#5bcefa" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '12px', fontWeight: 800 }}>Termo de Consentimento</h3>
            <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '16px', lineHeight: '1.6' }}>
              <strong>Todos os dados que forem cadastrados por você</strong> neste aplicativo serão anonimizados e poderão ser utilizados de forma agregada para a elaboração de <strong>políticas públicas</strong> e <strong>pesquisas acadêmicas</strong>.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px', lineHeight: '1.6' }}>
              Nosso objetivo principal é mapear a saúde pública e promover melhorias no acolhimento da nossa comunidade em todo o Brasil. Ao continuar, você concorda explicitamente com este uso.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
              <button 
                onClick={handleConfirmConsent}
                style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: 'white', border: 'none', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer' }}
              >
                Concordar e Continuar
              </button>
              <button 
                onClick={() => setShowConsentModal(false)}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', fontWeight: 600, cursor: 'pointer' }}
              >
                Voltar e Revisar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
