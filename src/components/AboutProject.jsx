import React from 'react';
import { ChevronLeft } from 'lucide-react';

const AboutProject = ({ onBack }) => {
  return (
    <div className="animate-fade-in" style={{ height: '100%', overflowY: 'auto', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button 
          onClick={onBack}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
        >
          <ChevronLeft size={24} />
        </button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'white' }}>Sobre o Projeto</h2>
      </div>

      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: '1.6' }}>
        <div>
          <h3 className="text-gradient-pride" style={{ fontSize: '1.3rem', marginBottom: '8px' }}>O que é o Acolhe+?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            O Acolhe+ é um sistema de mapeamento colaborativo focado na promoção do acolhimento em saúde para a população LGBTQIA+. Nascido em um grupo de trabalho da Elo Rede LGBT, seu objetivo é mitigar as barreiras de acesso e a evasão de pacientes, especialmente da comunidade T (pessoas trans, travestis e não-binárias), por meio da denúncia e avaliação das unidades de saúde.
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'white' }}>Como funciona?</h3>
          <ul style={{ color: 'var(--text-muted)', fontSize: '0.95rem', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong>Geofencing:</strong> Avaliações só são permitidas para usuários a uma distância máxima de 500m do estabelecimento.</li>
            <li><strong>Navegação Fluida:</strong> Mecânica de Swipe Cards nativa que mostra as unidades mais próximas.</li>
            <li><strong>Anonimato e Segurança:</strong> O sistema não expõe o nome dos denunciantes, garantindo sigilo absoluto enquanto atua como instrumento para políticas públicas.</li>
          </ul>
        </div>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'white' }}>O Desenvolvedor</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Idealizado e arquitetado por <strong>Whentony Soares Ferreira</strong>.<br/>
            Com trajetória em Letras, Análise de Sistemas, Mestrado em Administração e Doutorando em Modelagem Matemática e Computacional pelo CEFET/MG, Whentony tem mais de 5 anos de experiência como Desenvolvedor Full Stack, unindo sensibilidade humana ao mais alto rigor técnico (Engenharia de Software e Data Warehouse).
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutProject;
