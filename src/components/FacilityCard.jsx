import React, { useState } from 'react';
import { MapPin, Building, Navigation2, Map, Star } from 'lucide-react';
import './FacilityCard.css';

const FacilityCard = ({ facility, testimonials = [], onVote, onViewFeed, userLocation, onGoToMap }) => {
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Fórmula de Haversine para calcular distância entre duas coordenadas em metros
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const toRad = (value) => (value * Math.PI) / 180;
    const phi1 = toRad(lat1);
    const phi2 = toRad(lat2);
    const deltaPhi = toRad(lat2 - lat1);
    const deltaLambda = toRad(lon2 - lon1);

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; 
  };

  let distanceText = null;
  if (userLocation && facility.lat && facility.lng) {
    const dist = calculateDistance(userLocation.lat, userLocation.lng, facility.lat, facility.lng);
    distanceText = dist < 1000 ? `${Math.round(dist)}m` : `${(dist / 1000).toFixed(1)}km`;
  }

  const showError = (msg) => {
    setLocationError(msg);
    setTimeout(() => setLocationError(null), 5000); // Some depois de 5s
  };

  const handleVoteClick = (ratingValue) => {
    setLocationError(null);
    if (!navigator.geolocation) {
      showError("Seu navegador não suporta geolocalização.");
      return;
    }

    setIsCheckingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsCheckingLocation(false);
        const { latitude, longitude } = position.coords;
        const distance = calculateDistance(latitude, longitude, facility.lat, facility.lng);
        
        // BYPASS PARA TESTES: Removida a trava de 500 metros para que você possa testar o modal livremente.
        // if (distance <= 500) {
        onVote(ratingValue);
        // } else {
        //   const distanceText = distance < 1000 
        //     ? `${Math.round(distance)} metros` 
        //     : `${(distance / 1000).toFixed(1)}km`;
        //   showError(`Você está a ${distanceText} daqui. É necessário estar a no máximo 500 metros da unidade para avaliar.`);
        // }
      },
      (error) => {
        setIsCheckingLocation(false);
        if (error.code === error.PERMISSION_DENIED) {
          showError("Permita o acesso à localização para confirmar sua presença.");
        } else {
          showError("Não foi possível obter sua localização atual para validação.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const averageRating = testimonials.length > 0
    ? (testimonials.reduce((acc, t) => acc + (t.rating || 0), 0) / testimonials.length).toFixed(1)
    : 0;

  return (
    <div className="facility-card glass-panel animate-fade-in" style={{ justifyContent: 'center' }}>
      <div className="card-content">
        <h2 className="facility-name">{facility.name}</h2>
        <div className="facility-info">
          <span className="info-item">
            <Building size={16} className="text-gradient-pride" /> 
            <span className="text-gradient-pride" style={{ fontWeight: 700 }}>{facility.type}</span>
          </span>
          {distanceText && (
            <span className="info-item" style={{ color: '#5bcefa', fontWeight: 600 }}>
              <Navigation2 size={14} style={{ color: '#5bcefa' }} /> {distanceText}
            </span>
          )}
          <span className="info-item"><MapPin size={16} /> {facility.address}</span>
        </div>
        
        <button 
          onClick={onGoToMap}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid var(--glass-border)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            margin: '0 auto 16px auto',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <Map size={16} /> Ver no Mapa
        </button>
        
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '4px' }}>
          {testimonials.length > 0 ? (
            <span style={{ 
              backgroundColor: 'rgba(251, 191, 36, 0.15)',
              color: '#fbbf24',
              padding: '6px 12px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '1rem',
              fontWeight: 700
            }}>
              <Star size={16} fill="currentColor" /> {averageRating}
              <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 'normal', marginLeft: '4px' }}>
                ({testimonials.length} avaliações)
              </span>
            </span>
          ) : (
            <span style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#9ca3af',
              padding: '4px 8px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.85rem'
            }}>
              Sem avaliações
            </span>
          )}
        </div>
        
        <p className="card-prompt text-gradient-pride" style={{ fontSize: '1.1rem', marginTop: '16px', marginBottom: '16px' }}>
          {isCheckingLocation ? 'Verificando sua localização...' : 'Como foi o acolhimento neste local?'}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
          <button 
            className="action-btn glass-panel"
            onClick={() => handleVoteClick(0)} // Passamos 0, o usuário escolhe a nota real no modal
            disabled={isCheckingLocation}
            style={{ 
              background: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '24px',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              opacity: isCheckingLocation ? 0.7 : 1,
              transition: 'all 0.2s',
              width: '100%',
              maxWidth: '300px'
            }}
          >
            {isCheckingLocation ? 'Localizando...' : 'Avaliar Local'}
          </button>
        </div>
        
        {locationError && (
          <div style={{
            marginTop: '12px',
            padding: '10px 12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#fca5a5',
            fontSize: '0.9rem',
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease-in-out'
          }}>
            {locationError}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityCard;
