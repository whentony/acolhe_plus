import React, { useState, useRef } from 'react';
import { Settings, LogOut, Award, Shield, User, MessageSquare, Trash2, AlertTriangle, MapPin, Edit3, Check, X, ChevronLeft, Search } from 'lucide-react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import './Profile.css';

const libraries = ['places'];

const Profile = ({ user, onLogout, onNavigate, onUpdateUser }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeView, setActiveView] = useState('menu');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressData, setAddressData] = useState({
    cep: user?.address?.cep || '',
    street: user?.address?.street || '',
    number: user?.address?.number || '',
    neighborhood: user?.address?.neighborhood || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    lat: user?.address?.lat || null,
    lng: user?.address?.lng || null
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const autocompleteRef = useRef(null);

  const onLoadAutocomplete = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      
      if (!place.geometry) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      
      let street = '';
      let number = '';
      let neighborhood = '';
      let city = '';
      let state = '';
      let cep = '';

      if (place.address_components) {
        place.address_components.forEach(component => {
          const types = component.types;
          if (types.includes('route')) street = component.long_name;
          if (types.includes('street_number')) number = component.long_name;
          if (types.includes('sublocality') || types.includes('sublocality_level_1') || types.includes('neighborhood')) neighborhood = component.long_name;
          if (types.includes('administrative_area_level_2')) city = component.long_name;
          if (types.includes('administrative_area_level_1')) state = component.short_name;
          if (types.includes('postal_code')) cep = component.long_name;
        });
      }

      setAddressData(prev => ({
        ...prev,
        street: street || prev.street,
        number: number || prev.number,
        neighborhood: neighborhood || prev.neighborhood,
        city: city || prev.city,
        state: state || prev.state,
        cep: cep || prev.cep,
        lat,
        lng
      }));
    }
  };

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = () => {
    onUpdateUser({
      ...user,
      address: addressData
    });
    setActiveView('menu');
  };

  if (activeView === 'address') {
    return (
      <div className="profile-container animate-fade-in" style={{ height: '100%', overflowY: 'auto', padding: '20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button 
            onClick={() => setActiveView('menu')}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
          >
            <ChevronLeft size={24} />
          </button>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'white' }}>Endereço</h2>
        </div>

        <div className="address-section glass-panel">
          <div className="address-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Seu Endereço</h3>
            </div>
            <button className="edit-address-btn save" onClick={handleSaveAddress}>
              <Check size={16} /> Salvar
            </button>
          </div>

          <div className="address-form animate-fade-in">
            {isLoaded && (
              <div className="form-group" style={{ marginBottom: '16px', position: 'relative' }}>
                <label>Buscar Endereço Inteligente</label>
                <div style={{ position: 'relative' }}>
                  <Autocomplete
                    onLoad={onLoadAutocomplete}
                    onPlaceChanged={onPlaceChanged}
                    options={{ componentRestrictions: { country: 'br' } }}
                  >
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Digite para buscar na API do Google..." 
                      style={{ paddingLeft: '36px', width: '100%' }}
                    />
                  </Autocomplete>
                  <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  A busca automática preencherá os campos abaixo e salvará as coordenadas (lat/lng) para o mapeamento.
                </span>
              </div>
            )}
            
            <div className="form-row">
              <div className="form-group half">
                <label>CEP</label>
                <input type="text" name="cep" value={addressData.cep} onChange={handleAddressChange} className="form-input" placeholder="00000-000" />
              </div>
              <div className="form-group full">
                <label>Logradouro</label>
                <input type="text" name="street" value={addressData.street} onChange={handleAddressChange} className="form-input" placeholder="Rua, Avenida..." />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group small">
                <label>Número</label>
                <input type="text" name="number" value={addressData.number} onChange={handleAddressChange} className="form-input" placeholder="123" />
              </div>
              <div className="form-group flex-fill">
                <label>Bairro</label>
                <input type="text" name="neighborhood" value={addressData.neighborhood} onChange={handleAddressChange} className="form-input" placeholder="Bairro" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group flex-fill">
                <label>Cidade</label>
                <input type="text" name="city" value={addressData.city} onChange={handleAddressChange} className="form-input" placeholder="Cidade" />
              </div>
              <div className="form-group small">
                <label>UF</label>
                <input type="text" name="state" value={addressData.state} onChange={handleAddressChange} className="form-input" placeholder="SP" maxLength="2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container animate-fade-in">
      <div className="profile-header glass-panel">
        <h2 style={{ marginTop: 0 }}>{user?.name ? user.name : 'Seu Perfil'} {user?.pronouns && <span style={{fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 'normal'}}>({user.pronouns})</span>}</h2>
        <p>{user?.identity ? user.identity : 'Identidade não informada'}</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
          {user?.orientation && <span className="profile-badge">{user.orientation}</span>}
          {user?.race && <span className="profile-badge">{user.race}</span>}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <Award size={28} color="#22c55e" />
          <div className="stat-info">
            <h3>12</h3>
            <span>Locais Avaliados</span>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <Shield size={28} color="#8b5cf6" />
          <div className="stat-info">
            <h3>Nível 3</h3>
            <span>Acolhedor</span>
          </div>
        </div>
      </div>

      <div className="profile-actions" style={{ marginTop: '24px' }}>
        <button className="action-btn glass-panel" onClick={() => onNavigate('my-reports')}>
          <MessageSquare size={20} />
          Meus Relatos
        </button>
        <button className="action-btn glass-panel" onClick={() => setActiveView('address')}>
          <MapPin size={20} />
          Endereço Completo
        </button>
        <button className="action-btn glass-panel">
          <Settings size={20} />
          Configurações
        </button>
        <button className="action-btn glass-panel btn-logout" onClick={onLogout}>
          <LogOut size={20} />
          Sair
        </button>
        <button 
          className="action-btn glass-panel" 
          style={{ color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 size={20} color="#fca5a5" />
          Excluir Conta
        </button>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay animate-fade-in" style={{ zIndex: 1000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '12px' }}>Excluir Conta?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>
              Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus relatos anonimizados serão preservados na plataforma.
            </p>
            
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button 
                onClick={() => setShowDeleteModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 600 }}
              >
                Cancelar
              </button>
              <button 
                onClick={onLogout}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)', fontWeight: 600 }}
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
