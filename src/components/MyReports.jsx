import React, { useMemo } from 'react';
import { ArrowLeft, MessageSquare, Star } from 'lucide-react';
import './MyReports.css';

const MyReports = ({ user, testimonials, facilities, onBack, onGoToMap }) => {
  // Extrair todos os relatos feitos por este usuário
  const userReports = useMemo(() => {
    const reports = [];
    
    // Iterar sobre todos os locais que têm relatos
    Object.keys(testimonials).forEach(facilityId => {
      const facilityTestimonials = testimonials[facilityId];
      
      // Encontrar relatos que pertencem ao usuário atual
      const myTestimonials = facilityTestimonials.filter(t => t.name === user.name);
      
      if (myTestimonials.length > 0) {
        // Encontrar os dados do local (nome, etc)
        const facility = facilities.find(f => f.id === facilityId) || { name: 'Unidade de Saúde Desconhecida' };
        
        myTestimonials.forEach(t => {
          reports.push({
            ...t,
            facilityName: facility.name,
            facilityId: facilityId
          });
        });
      }
    });
    
    return reports;
  }, [user, testimonials, facilities]);

  return (
    <div className="my-reports-container animate-fade-in">
      <div className="reports-header">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>Meus Relatos</h2>
      </div>

      {userReports.length === 0 ? (
        <div className="empty-reports glass-panel">
          <MessageSquare size={48} color="rgba(148, 163, 184, 0.5)" />
          <h3>Nenhum relato ainda</h3>
          <p>Você ainda não avaliou nenhuma unidade de saúde. Suas avaliações ajudam outras pessoas da comunidade a encontrarem locais seguros e acolhedores.</p>
          <button className="btn-start-mapping" onClick={onGoToMap}>
            Começar a mapear
          </button>
        </div>
      ) : (
        <div className="reports-list">
          {userReports.map((report, index) => (
            <div key={index} className={`report-history-card glass-panel ${report.isPositive ? 'positive' : 'negative'}`}>
              <div className="report-history-header">
                <div className="report-facility-info">
                  <h3>{report.facilityName}</h3>
                  <p>Avaliação comunitária</p>
                </div>
                
                <div className={`report-vote-badge`} style={{ background: 'transparent', border: 'none', padding: 0 }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star} 
                        size={14} 
                        fill={star <= (report.rating || 0) ? '#fbbf24' : 'transparent'} 
                        color={star <= (report.rating || 0) ? '#fbbf24' : 'rgba(255, 255, 255, 0.2)'} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {report.content && (
                <div className="report-history-content">
                  <p>"{report.content}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
