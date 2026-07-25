import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FacilityCard from './components/FacilityCard';
import TestimonialFeed from './components/TestimonialFeed';
import ReportModal from './components/ReportModal';
import BottomMenu from './components/BottomMenu';
import GlobalMap from './components/GlobalMap';
import Profile from './components/Profile';
import MyReports from './components/MyReports';
import Register from './components/Register';
import Login from './components/Login';
import { MOCK_FACILITIES, INITIAL_TESTIMONIALS, SPECIALIZED_CLINICS } from './mocks/data';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import SpecializedClinics from './components/SpecializedClinics';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  
  const [facilities, setFacilities] = useState(MOCK_FACILITIES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState(INITIAL_TESTIMONIALS);
  const [mapTargetLocation, setMapTargetLocation] = useState(null);
  
  const [activeVote, setActiveVote] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('evaluate');
  const [userLocation, setUserLocation] = useState(null);

  const [isLoginView, setIsLoginView] = useState(true);

  // Ordena os locais pelo mais próximo quando o usuário faz login
  useEffect(() => {
    if (user && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
          const R = 6371e3;
          const φ1 = lat1 * Math.PI/180;
          const φ2 = lat2 * Math.PI/180;
          const Δφ = (lat2-lat1) * Math.PI/180;
          const Δλ = (lon2-lon1) * Math.PI/180;
          const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          return R * c;
        };

        setFacilities(prev => {
          const withinRadius = [...prev].map(f => {
            return { ...f, tempDist: calculateDistance(latitude, longitude, f.lat, f.lng) };
          }).filter(f => f.tempDist <= 50000) // Raio máximo de exibição: 50km
          .sort((a, b) => a.tempDist - b.tempDist);
          
          return withinRadius;
        });
        setCurrentIndex(0);
      }, (error) => {
        console.warn("Permissão de localização negada ou indisponível. Usando ordem padrão.");
      });
    }
  }, [user]);

  const currentFacility = facilities[currentIndex];

  if (!user) {
    if (isLoginView) {
      return <Login 
        onLogin={setUser} 
        onSwitchMode={() => setIsLoginView(false)} 
      />;
    }
    return <Register 
      onComplete={setUser} 
      onSwitchMode={() => setIsLoginView(true)} 
    />;
  }

  const handleVote = (isPositive) => {
    setActiveVote(isPositive);
    setShowModal(true);
  };

  const handleModalSubmit = (reportData) => {
    reportData.name = user.identity || 'Membro da Comunidade';

    setTestimonials(prev => ({
      ...prev,
      [currentFacility.id]: [reportData, ...(prev[currentFacility.id] || [])]
    }));
    
    setShowModal(false);
    setActiveVote(null);
    goToNextFacility();
  };

  const goToNextFacility = () => {
    if (currentIndex < facilities.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
    setActiveTab('evaluate');
  };

  const goToPrevFacility = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(facilities.length - 1);
    }
    setActiveTab('evaluate');
  };

  const handleSelectFacilityFromMap = (facilityId, targetTab = 'evaluate') => {
    const idx = facilities.findIndex(f => f.id === facilityId);
    if (idx !== -1) {
      setCurrentIndex(idx);
      setActiveTab(targetTab);
    }
  };

  const handleAddDynamicFacility = (newFacility) => {
    setFacilities(prev => {
      if (prev.some(f => f.id === newFacility.id)) return prev;
      return [...prev, newFacility];
    });

    // Injeta avaliações mocadas para fins de demonstração
    setTestimonials(prev => {
      if (prev[newFacility.id]) return prev;
      
      const rating = Math.floor(Math.random() * 5) + 1;
      const mockReviews = [
        {
          id: Date.now(),
          name: 'Anônimo',
          rating: rating,
          text: rating >= 3 ? 'Fui muito bem recebida e respeitaram meu nome.' : 'Profissionais despreparados, erraram meu pronome várias vezes na fila.',
          date: new Date().toISOString().split('T')[0]
        },
        {
          id: Date.now() + 1,
          name: 'Alex',
          rating: 5,
          text: 'Atendimento humanizado, recomendo.',
          date: new Date().toISOString().split('T')[0]
        }
      ];

      return {
        ...prev,
        [newFacility.id]: mockReviews
      };
    });
  };

  const handleTabChange = (tab) => {
    if (tab === 'map') {
      setMapTargetLocation(null);
    }
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'specialized':
        return (
          <SpecializedClinics 
            onGoToMap={(clinic) => {
              setMapTargetLocation({ lat: clinic.lat, lng: clinic.lng });
              setActiveTab('map');
            }}
          />
        );
      case 'map':
        return (
          <GlobalMap 
            facilities={[...facilities, ...SPECIALIZED_CLINICS]}
            testimonials={testimonials}
            targetLocation={mapTargetLocation}
            onSelectFacility={handleSelectFacilityFromMap} 
            onAddDynamicFacility={handleAddDynamicFacility}
          />
        );
      case 'profile':
        return <Profile user={user} onLogout={() => setUser(null)} onNavigate={setActiveTab} onUpdateUser={setUser} />;
      case 'my-reports':
        return <MyReports 
          user={user} 
          testimonials={testimonials} 
          facilities={facilities} 
          onBack={() => setActiveTab('profile')}
          onGoToMap={() => setActiveTab('map')}
        />;
      case 'feed':
        return (
          <TestimonialFeed 
            testimonials={testimonials[currentFacility.id] || []} 
            onClose={() => setActiveTab('evaluate')}
          />
        );
      case 'evaluate':
      default:
        if (!currentFacility) {
          return (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <h2>Nenhum local próximo</h2>
              <p>Não encontramos unidades de saúde no seu raio de alcance (50km).</p>
            </div>
          );
        }

        return (
          <div className="tinder-layout" style={{ position: 'relative', width: '100%', maxWidth: '480px', margin: '0 auto' }}>
            <Swiper
              effect={'cards'}
              grabCursor={true}
              modules={[EffectCards]}
              onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
              initialSlide={currentIndex}
              style={{ width: '100%', height: '100%' }}
            >
              {facilities.map((facility) => (
                <SwiperSlide key={facility.id}>
                  <FacilityCard 
                    facility={facility} 
                    testimonials={testimonials[facility.id] || []}
                    onVote={(type) => {
                      setActiveVote(type);
                      setShowModal(true);
                    }} 
                    userLocation={userLocation}
                    onGoToMap={() => {
                      setMapTargetLocation({ lat: facility.lat, lng: facility.lng });
                      setActiveTab('map');
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <header style={{ 
        textAlign: 'center', 
        padding: 'calc(16px + env(safe-area-inset-top, 0px)) 0 16px 0', 
        fontSize: '1.4rem', 
        fontWeight: 800, 
        letterSpacing: '1.5px',
        background: 'transparent',
        zIndex: 10,
        margin: '0 -20px'
      }}>
        <span className="text-gradient-pride">Acolhe+</span>
      </header>
      <main className="app-main" style={{ flex: 1, overflow: 'hidden' }}>
        {renderContent()}
      </main>

      <BottomMenu activeTab={activeTab} onTabChange={handleTabChange} />

      {showModal && (
        <ReportModal 
          voteType={activeVote}
          facilityName={currentFacility.name}
          user={user}
          onSubmit={handleModalSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default App;
