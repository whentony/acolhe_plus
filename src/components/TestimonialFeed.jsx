import React from 'react';
import { Heart, X, MessageSquare } from 'lucide-react';
import './TestimonialFeed.css';

const TestimonialFeed = ({ testimonials, onClose }) => {
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="testimonial-empty glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <MessageSquare size={40} color="var(--text-muted)" />
        <p>Ainda não há relatos para este local. Seja o primeiro a ajudar a comunidade!</p>
        {onClose && (
          <button className="btn-feed mt-4" onClick={onClose}>Voltar para o local</button>
        )}
      </div>
    );
  }

  return (
    <div className="testimonial-feed">
      <div className="feed-header">
        <h3 className="feed-title">Relatos da Comunidade</h3>
        {onClose && (
          <button className="btn-close-feed" onClick={onClose}>Voltar</button>
        )}
      </div>
      <div className="feed-list">
        {testimonials.map((t, index) => (
          <div 
            key={t.id} 
            className={`testimonial-card glass-panel animate-fade-in ${t.recommended ? 'card-positive' : 'card-negative'}`}
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            <div className="card-header">
              <div className="user-avatar" style={{ background: t.recommended ? '#22c55e' : '#ef4444' }}>
                {t.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h4>{t.name}</h4>
                <span className="date">{new Date(t.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="card-rating">
                {t.recommended ? <Heart size={20} color="#22c55e" fill="#22c55e" /> : <X size={20} color="#ef4444" />}
              </div>
            </div>
            <p className="card-text">"{t.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialFeed;
