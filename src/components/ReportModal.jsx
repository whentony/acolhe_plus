import React, { useState } from 'react';
import { Send, X as CloseIcon, Star } from 'lucide-react';
import './ReportModal.css';

const ReportModal = ({ voteType, facilityName, user, onSubmit, onClose }) => {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(voteType || 5);
  const userIdentity = user?.identity || 'Membro da Comunidade';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSubmit({
      id: Date.now(),
      rating: rating,
      text,
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="modal-overlay">
      <div className={`modal-content glass-panel`} style={{ borderTop: '4px solid #fbbf24' }}>
        <button className="close-btn" onClick={onClose}>
          <CloseIcon size={20} />
        </button>

        <h3 className="modal-title">
          {rating >= 4 ? 'Que ótimo saber!' : rating === 3 ? 'Agradecemos o feedback.' : 'Sinto muito pela sua experiência.'}
        </h3>
        <p className="modal-subtitle">
          Deixe um relato sobre o atendimento no <strong>{facilityName}</strong>. 
          Sua nota atual:
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: star <= rating ? '#fbbf24' : 'rgba(255, 255, 255, 0.2)',
                transition: 'all 0.2s'
              }}
            >
              <Star size={28} fill="currentColor" />
            </button>
          ))}
        </div>

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

          <button type="submit" className={`submit-btn`} style={{ backgroundColor: '#fbbf24', color: '#000', fontWeight: 'bold' }} disabled={!text.trim()}>
            <span>Enviar Relato</span>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
