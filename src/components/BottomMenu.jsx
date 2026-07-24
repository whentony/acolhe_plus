import React from 'react';
import { Layers, MessageSquare, Map as MapIcon, User, HeartPulse } from 'lucide-react';
import './BottomMenu.css';

const BottomMenu = ({ activeTab, onTabChange }) => {
  return (
    <div className="bottom-menu glass-panel">
      <button 
        className={`menu-item ${activeTab === 'evaluate' ? 'active' : ''}`}
        onClick={() => onTabChange('evaluate')}
      >
        <Layers size={24} />
        <span>Avaliar</span>
      </button>

      <button 
        className={`menu-item ${activeTab === 'specialized' ? 'active' : ''}`}
        onClick={() => onTabChange('specialized')}
      >
        <HeartPulse size={24} />
        <span>Especialistas</span>
      </button>

      <button 
        className={`menu-item ${activeTab === 'map' ? 'active' : ''}`}
        onClick={() => onTabChange('map')}
      >
        <MapIcon size={24} />
        <span>Mapa</span>
      </button>



      <button 
        className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => onTabChange('profile')}
      >
        <User size={24} />
        <span>Perfil</span>
      </button>
    </div>
  );
};

export default BottomMenu;
