import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, CircleF } from '@react-google-maps/api';
import { Search, Heart, X, Navigation, ThumbsUp, ThumbsDown } from 'lucide-react';
import './GlobalMap.css';

const libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '65vh',
  borderRadius: '16px'
};

// Estilo escuro para combinar com a estética do app
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.medical",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  }
];

const GlobalMap = ({ facilities, testimonials, onSelectFacility, onAddDynamicFacility, targetLocation }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const [map, setMap] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeCenter, setActiveCenter] = useState({ lat: -14.2350, lng: -51.9253 });
  const [activeZoom, setActiveZoom] = useState(4);
  const [activeFacilityId, setActiveFacilityId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
    placesService.current = new window.google.maps.places.PlacesService(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  // Inicializar busca do usuário
  useEffect(() => {
    if (isLoaded && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          
          if (!targetLocation) {
            setActiveCenter({ lat, lng });
            setActiveZoom(15);
          }
          
          if (placesService.current) {
            searchNearbyHospitals(lat, lng);
          }
        },
        (error) => {
          console.log("Localização bloqueada pelo usuário.", error);
        }
      );
    }
  }, [isLoaded]);

  // Focar no targetLocation se ele mudar, ou focar no usuário se for null
  useEffect(() => {
    if (isLoaded && map) {
      if (targetLocation) {
        setActiveCenter(targetLocation);
        setActiveZoom(16);
        map.panTo(targetLocation);
      } else if (userLocation) {
        setActiveCenter(userLocation);
        setActiveZoom(15);
        map.panTo(userLocation);
      }
    }
  }, [targetLocation, userLocation, isLoaded, map]);

  const searchNearbyHospitals = (lat, lng) => {
    if (!placesService.current) return;

    const request = {
      location: { lat, lng },
      radius: '4000',
      keyword: 'posto de saúde OR hospital OR clínica OR ubs'
    };

    placesService.current.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        results.forEach(place => {
          if (!facilities.some(f => f.id === place.place_id)) {
            const mockFacility = {
              id: place.place_id,
              name: place.name,
              address: place.vicinity || 'Endereço detectado via satélite',
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              type: place.types.includes('hospital') ? 'Hospital' : 'Clínica / UBS',
              image: place.photos && place.photos.length > 0 
                ? place.photos[0].getUrl() 
                : 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            };
            onAddDynamicFacility(mockFacility);
          }
        });
      }
    });
  };

  // Autocomplete do Google Maps
  useEffect(() => {
    if (!isLoaded || searchTerm.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    if (!autocompleteService.current) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }

    const delayDebounceFn = setTimeout(() => {
      autocompleteService.current.getPlacePredictions({
        input: searchTerm,
        componentRestrictions: { country: 'br' }
      }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          
          // Verifica os locais mockados/locais primeiro
          const localMatches = facilities.filter(f => 
            f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            f.address.toLowerCase().includes(searchTerm.toLowerCase())
          ).map(f => ({
            isLocal: true,
            place_id: f.id,
            display_name: `📍 ${f.name} - ${f.address}`,
            lat: f.lat,
            lng: f.lng
          }));

          const googleMatches = predictions.map(p => ({
            isLocal: false,
            place_id: p.place_id,
            display_name: p.description
          }));

          setSuggestions([...localMatches, ...googleMatches].slice(0, 5));
        } else {
          setSuggestions([]);
        }
      });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isLoaded, facilities]);

  const handleSelectSuggestion = (place) => {
    setSearchTerm(place.display_name.replace('📍 ', ''));
    setSuggestions([]);
    
    if (place.isLocal) {
      setActiveCenter({ lat: place.lat, lng: place.lng });
      setActiveZoom(16);
      setActiveFacilityId(place.place_id);
    } else {
      // É um local do Google, precisamos pegar as coordenadas
      if (placesService.current) {
        placesService.current.getDetails({ placeId: place.place_id }, (details, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            
            // FILTRAGEM RIGOROSA DE SAÚDE
            const validTypes = ['hospital', 'doctor', 'health', 'pharmacy', 'dentist', 'physiotherapist', 'clinic'];
            const isHealthRelated = details.types && details.types.some(t => validTypes.includes(t));
            const hasHealthKeyword = details.name && /(saúde|saude|hospital|clínica|clinica|ubs|posto|médico|medico|consultório|upa)/i.test(details.name);

            if (!isHealthRelated && !hasHealthKeyword) {
               alert("Este endereço não foi classificado pelo Google como uma unidade de saúde. Por favor, busque apenas postos, hospitais ou clínicas reais.");
               return;
            }

            const lat = details.geometry.location.lat();
            const lng = details.geometry.location.lng();
            
            setActiveCenter({ lat, lng });
            setActiveZoom(16);

            const newFacility = {
              id: place.place_id,
              name: details.name,
              address: details.formatted_address,
              lat: lat,
              lng: lng,
              type: details.types.includes('hospital') ? 'Hospital' : 'Clínica / UBS',
              image: details.photos && details.photos.length > 0 
                ? details.photos[0].getUrl() 
                : 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            };
            onAddDynamicFacility(newFacility);
            setActiveFacilityId(place.place_id);
          }
        });
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelectSuggestion(suggestions[0]);
    }
  };

  const activeFacility = activeFacilityId ? facilities.find(f => f.id === activeFacilityId) : null;
  const facilityTestimonials = activeFacility ? (testimonials[activeFacility.id] || []) : [];
  const totalReviews = facilityTestimonials.length;
  const positiveReviews = facilityTestimonials.filter(t => t.recommended).length;
  const percentage = totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0;

  if (loadError) {
    return <div className="global-map-container">Erro ao carregar o Google Maps.</div>;
  }

  if (!isLoaded) {
    return <div className="global-map-container">Carregando mapa...</div>;
  }

  return (
    <div className="global-map-container animate-fade-in">
      <div className="map-header">
        <h2>Mapa de Acolhimento</h2>
        <p>Busque seu endereço para encontrar as unidades de saúde oficiais mais próximas.</p>
        <div className="search-container">
          <form onSubmit={handleSearchSubmit} className="search-bar">
            <input 
              type="text" 
              placeholder="Digite sua rua, bairro ou cidade..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <Search size={20} />
            </button>
          </form>

          {suggestions.length > 0 && (
            <ul className="suggestions-dropdown glass-panel">
              {suggestions.map((place, index) => (
                <li 
                  key={place.place_id || index} 
                  onClick={() => handleSelectSuggestion(place)}
                  className="suggestion-item"
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="map-wrapper glass-panel">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={activeCenter}
          zoom={activeZoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            styles: darkMapStyle,
            disableDefaultUI: true,
            zoomControl: false
          }}
        >
          {userLocation && (
            <CircleF
              center={userLocation}
              radius={30}
              options={{
                fillColor: '#3b82f6',
                fillOpacity: 0.6,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }}
            />
          )}

          {facilities.map(facility => {
            const isHospital = facility.type?.toLowerCase().includes('hospital');
            // Como SVG customizado para o Google Maps Marker
            const svgIcon = {
              url: isHospital 
                ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg width="36" height="36" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="16" fill="#f5a9b8" stroke="white" stroke-width="3"/><text x="18" y="23" font-size="16" text-anchor="middle" fill="white">🏥</text></svg>')
                : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg width="36" height="36" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="16" fill="#5bcefa" stroke="white" stroke-width="3"/><text x="18" y="23" font-size="16" text-anchor="middle" fill="white">🩺</text></svg>'),
              scaledSize: new window.google.maps.Size(36, 36),
              anchor: new window.google.maps.Point(18, 18),
            };

            return (
              <MarkerF
                key={facility.id}
                position={{ lat: facility.lat, lng: facility.lng }}
                icon={svgIcon}
                onClick={() => {
                  setActiveFacilityId(facility.id);
                  setActiveCenter({ lat: facility.lat, lng: facility.lng });
                }}
              />
            );
          })}
        </GoogleMap>

        {activeFacility && (
          <div className="bottom-facility-card animate-fade-in glass-panel">
            <button className="close-card-btn" onClick={() => setActiveFacilityId(null)}>
              <X size={20} />
            </button>
            
            <div className="popup-badge">
              {activeFacility.type.includes('Hospital') ? '🏥 Hospital' : '📍 Unidade de Saúde'}
            </div>
            
            <h3 className="facility-card-title">{activeFacility.name}</h3>
            
            <div className="popup-stats">
              <span className="stat-pill positive" style={{ opacity: totalReviews === 0 ? 0.5 : 1 }}>
                <ThumbsUp size={14} fill="currentColor" /> {positiveReviews}
              </span>
              <span className="stat-pill negative" style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                color: '#ef4444', 
                border: '1px solid rgba(239, 68, 68, 0.3)',
                opacity: totalReviews === 0 ? 0.5 : 1
              }}>
                <ThumbsDown size={14} fill="currentColor" /> {totalReviews - positiveReviews}
              </span>
              
              {totalReviews > 0 ? (
                <span className="stat-pill neutral" style={{ fontWeight: 'bold' }}>
                  {percentage}% Acolhedor
                </span>
              ) : (
                <span className="stat-pill new">Sem avaliações</span>
              )}
            </div>

            <p className="facility-card-address">{activeFacility.address}</p>

            <div className="popup-actions facility-card-actions">
              <button onClick={() => onSelectFacility(activeFacility.id, 'evaluate')} className="btn-popup btn-evaluate">
                Avaliar Local
              </button>
              <button onClick={() => onSelectFacility(activeFacility.id, 'feed')} className="btn-popup btn-feed">
                Ver Relatos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalMap;
