import React from 'react';
import { MessageSquare, Star, ArrowLeft } from 'lucide-react';
import './TestimonialFeed.css';

const TestimonialFeed = ({ testimonials, onClose }) => {
  return (
    <div className="testimonial-feed animate-fade-in">
      <div className="feed-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        {onClose && (
          <button 
            className="btn-back" 
            onClick={onClose}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--glass-border)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h3 className="feed-title" style={{ margin: 0 }}>Relatos da Comunidade</h3>
      </div>
      
      {(!testimonials || testimonials.length === 0) ? (
        <div className="testimonial-empty glass-panel animate-fade-in" style={{ animationDelay: '0.2s', textAlign: 'center', padding: '32px 24px' }}>
          <MessageSquare size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px auto' }} />
          <p>Ainda não há relatos para este local. Seja o primeiro a ajudar a comunidade!</p>
        </div>
      ) : (
        <div className="feed-list">
          {testimonials.map((t, index) => (
            <div 
              key={t.id} 
              className={`testimonial-card glass-panel animate-fade-in`}
              style={{ animationDelay: `${0.1 * (index + 1)}s`, borderLeft: `4px solid ${t.rating >= 4 ? '#34d399' : t.rating === 3 ? '#fbbf24' : '#f87171'}` }}
            >
              <div className="card-header">
                <div className="user-avatar" style={{ background: 'var(--accent-primary)' }}>
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <h4>{t.name}</h4>
                  <span className="date">{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="card-rating" style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={14} 
                      fill={star <= (t.rating || 0) ? '#fbbf24' : 'transparent'} 
                      color={star <= (t.rating || 0) ? '#fbbf24' : 'rgba(255, 255, 255, 0.2)'} 
                    />
                  ))}
                </div>
              </div>
              <p className="card-text">"{t.text}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialFeed;
