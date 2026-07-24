import React, { useState } from 'react';
import { HeartPulse, MapPin, ChevronRight, Star, ExternalLink, Phone } from 'lucide-react';
import './SpecializedClinics.css';
import { SPECIALIZED_CLINICS } from '../mocks/data';

const SpecializedClinics = ({ onGoToMap }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClinics = SPECIALIZED_CLINICS.filter(clinic => 
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    clinic.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="specialized-container animate-fade-in">
      <header className="specialized-header">
        <div className="header-title">
          <HeartPulse size={28} className="header-icon" />
          <h2>Clínicas Especializadas</h2>
        </div>
        <p>Centros de referência em saúde e transição com atendimento humanizado.</p>
      </header>

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Buscar por nome, especialidade ou cidade..." 
          className="form-input search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="clinics-list">
        {filteredClinics.length > 0 ? (
          filteredClinics.map(clinic => (
            <div key={clinic.id} className="clinic-card glass-panel">
              <div className="clinic-image-wrapper">
                <div 
                  className="clinic-image" 
                  style={{ backgroundImage: `url(${clinic.image})` }}
                />
                <div className="clinic-badge">
                  <Star size={12} />
                  <span>{clinic.rating}</span>
                </div>
              </div>
              
              <div className="clinic-content">
                <div className="clinic-header-info">
                  <span className="clinic-specialty">{clinic.specialty}</span>
                  {clinic.isPublic && <span className="clinic-public-badge">SUS</span>}
                </div>
                
                <h3 className="clinic-name">{clinic.name}</h3>
                
                <div className="clinic-location">
                  <MapPin size={14} />
                  <span>{clinic.address}, {clinic.city}</span>
                </div>
                
                <p className="clinic-description">{clinic.description}</p>
                
                <div className="clinic-actions">
                  <button className="action-btn outline">
                    <Phone size={16} />
                    <span>Ligar</span>
                  </button>
                  <button className="action-btn primary" onClick={() => onGoToMap(clinic)}>
                    <ExternalLink size={16} />
                    <span>Ver no Mapa</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>Nenhuma clínica encontrada para a sua busca.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecializedClinics;
