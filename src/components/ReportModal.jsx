import React, { useState } from 'react';
import { Send, X as CloseIcon } from 'lucide-react';
import './ReportModal.css';

const ReportModal = ({ voteType, facilityName, user, onSubmit, onClose }) => {
  const [text, setText] = useState('');
  const isPositive = voteType === true;
  const userIdentity = user?.identity || 'Membro da Comunidade';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSubmit({
      id: Date.now(),
      recommended: voteType,
      text,
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="modal-overlay">
      <div className={`modal-content glass-panel ${isPositive ? 'positive-border' : 'negative-border'}`}>
        <button className="close-btn" onClick={onClose}>
          <CloseIcon size={20} />
        </button>

        <h3 className="modal-title">
          {isPositive ? 'Que ótimo saber!' : 'Sinto muito pela sua experiência.'}
        </h3>
        <p className="modal-subtitle">
          Deixe um relato sobre o atendimento no <strong>{facilityName}</strong>. 
          Isso ajudará outras pessoas da comunidade.
        </p>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          padding: '10px 14px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '1.2rem' }}>🕵️‍♀️</span>
          <span>
            Seu relato será 100% anônimo. Exibiremos apenas sua identidade: <strong style={{ color: 'white' }}>{userIdentity}</strong>
          </span>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <textarea
              placeholder="Conte-nos em detalhes como foi o acolhimento..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={4}
              className="form-input form-textarea"
            />
          </div>

          <button type="submit" className={`submit-btn ${isPositive ? 'btn-green' : 'btn-red'}`} disabled={!text.trim()}>
            <span>Enviar Relato</span>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
