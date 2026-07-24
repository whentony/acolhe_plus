import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { X, Heart, MapPin, Building, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Navigation2 } from 'lucide-react';
import './FacilityCard.css';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  zIndex: 1
};

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] }
];

const libraries = ['places'];

const FacilityCard = ({ facility, testimonials = [], onVote, onViewFeed, userLocation }) => {
  const [showMap, setShowMap] = useState(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const center = { lat: facility.lat, lng: facility.lng };

  const isHospital = facility.type?.toLowerCase().includes('hospital');
  const svgIcon = {
    url: isHospital 
      ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg width="36" height="36" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="16" fill="#f5a9b8" stroke="white" stroke-width="3"/><text x="18" y="23" font-size="16" text-anchor="middle" fill="white">🏥</text></svg>')
      : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg width="36" height="36" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="16" fill="#5bcefa" stroke="white" stroke-width="3"/><text x="18" y="23" font-size="16" text-anchor="middle" fill="white">🩺</text></svg>'),
    scaledSize: (isLoaded && window.google && window.google.maps) ? new window.google.maps.Size(36, 36) : null,
    anchor: (isLoaded && window.google && window.google.maps) ? new window.google.maps.Point(18, 18) : null,
  };

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

  const handleVoteClick = (isPositive) => {
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
        
        if (distance <= 500) {
          onVote(isPositive);
        } else {
          const distanceText = distance < 1000 
            ? `${Math.round(distance)} metros` 
            : `${(distance / 1000).toFixed(1)}km`;
          showError(`Você está a ${distanceText} daqui. É necessário estar a no máximo 500 metros da unidade para avaliar.`);
        }
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

  return (
    <div className="facility-card glass-panel animate-fade-in">
      <div className="card-media">
        {showMap ? (
          <div className="map-view">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={15}
                options={{
                  styles: darkMapStyle,
                  disableDefaultUI: true,
                  zoomControl: false,
                  gestureHandling: 'none' // equivalente a scrollWheelZoom={false} e draggable={false}
                }}
              >
                <MarkerF position={center} icon={window.google ? svgIcon : null} />
              </GoogleMap>
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#0f172a' }}></div>
            )}
          </div>
        ) : (
          <div className="image-view" style={{ backgroundImage: `url(${facility.image})` }}>
            <div className="image-overlay"></div>
          </div>
        )}
        
        <button className="toggle-map-btn" onClick={() => setShowMap(!showMap)}>
          {showMap ? 'Ocultar Mapa' : 'Ver no Mapa'}
          {showMap ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

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
        
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
          <span className="stat-pill positive" style={{ 
            opacity: testimonials.length === 0 ? 0.5 : 1,
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            color: '#22c55e',
            padding: '4px 8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            <ThumbsUp size={14} /> {testimonials.filter(t => t.recommended).length}
          </span>
          <span className="stat-pill negative" style={{ 
            opacity: testimonials.length === 0 ? 0.5 : 1,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            padding: '4px 8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            <ThumbsDown size={14} /> {testimonials.filter(t => !t.recommended).length}
          </span>
          {testimonials.length > 0 ? (
            <span style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              {Math.round((testimonials.filter(t => t.recommended).length / testimonials.length) * 100)}% Acolhedor
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
        
        <p className="card-prompt text-gradient-pride" style={{ fontSize: '1.1rem', marginTop: '8px' }}>
          {isCheckingLocation ? 'Verificando sua localização...' : 'Como foi o acolhimento neste local?'}
        </p>
        
        <div className="action-buttons">
          <button 
            className="btn-dislike" 
            onClick={() => handleVoteClick(false)}
            disabled={isCheckingLocation}
            style={{ opacity: isCheckingLocation ? 0.5 : 1 }}
          >
            <X size={32} />
          </button>

          <button 
            className="btn-like" 
            onClick={() => handleVoteClick(true)}
            disabled={isCheckingLocation}
            style={{ opacity: isCheckingLocation ? 0.5 : 1 }}
          >
            <Heart size={32} />
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
