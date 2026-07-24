export const MOCK_FACILITIES = [
  { 
    id: 'f1', 
    name: 'Hospital das Clínicas', 
    type: 'Hospital Público',
    address: 'Av. Dr. Enéas Carvalho de Aguiar, 255 - SP',
    lat: -23.5575, 
    lng: -46.6677,
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'f2', 
    name: 'Centro de Referência LGBT', 
    type: 'Centro de Saúde Especializado',
    address: 'Rua Frei Caneca, 100 - SP',
    lat: -23.5528, 
    lng: -46.6508,
    image: 'https://images.unsplash.com/photo-1538108149393-cebb47acdd4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'f3', 
    name: 'Hospital Municipal Souza Aguiar', 
    type: 'Hospital Público',
    address: 'Praça da República, 111 - Rio de Janeiro, RJ',
    lat: -22.9068, 
    lng: -43.1900,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'f4', 
    name: 'Maternidade Climério de Oliveira', 
    type: 'Hospital Universitário',
    address: 'R. do Limoeiro, 1 - Salvador, BA',
    lat: -12.9714, 
    lng: -38.5014,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'f5', 
    name: 'Hospital 28 de Agosto', 
    type: 'Hospital Pronto Socorro',
    address: 'R. Recife, 1581 - Manaus, AM',
    lat: -3.1019, 
    lng: -60.0250,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'f6', 
    name: 'HOSPITAL SAO SEBASTIAO DE SABINOPOLIS', 
    type: 'Hospital',
    address: 'R. Inácio Barroso, 331 - Centro, Sabinópolis',
    lat: -18.6653, 
    lng: -43.0805,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'f7', 
    name: 'Posto de Saúde Centro', 
    type: 'UBS',
    address: 'Praça da Matriz, 42 - Centro, Sabinópolis',
    lat: -18.6670, 
    lng: -43.0820,
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'f8', 
    name: 'Clínica da Família', 
    type: 'Clínica',
    address: 'R. São Vicente, 105 - Sabinópolis',
    lat: -18.6630, 
    lng: -43.0780,
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

export const SPECIALIZED_CLINICS = [
  {
    id: 'sp1',
    name: 'Ambulatório Transdisciplinar (AMTIGOS)',
    specialty: 'Endocrinologia & Terapia Hormonal',
    address: 'Hospital das Clínicas - Cerqueira César',
    city: 'São Paulo',
    lat: -23.5558,
    lng: -46.6681,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: '4.9',
    isPublic: true,
    description: 'Referência nacional do SUS no atendimento a pessoas trans. Oferece acompanhamento hormonal, psicológico e encaminhamento para cirurgias de afirmação de gênero.'
  },
  {
    id: 'sp2',
    name: 'Espaço de Saúde Transcendental',
    specialty: 'Psicologia e Psiquiatria',
    address: 'Rua Augusta, 1500 - Consolação',
    city: 'São Paulo',
    lat: -23.5575,
    lng: -46.6600,
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: '4.8',
    isPublic: false,
    description: 'Clínica multiprofissional com foco em saúde mental LGBTQIA+. Equipe formada majoritariamente por profissionais trans e travestis.'
  },
  {
    id: 'sp3',
    name: 'Centro de Cidadania LGBT',
    specialty: 'Acolhimento Social e Jurídico',
    address: 'Av. Paulista, 1234 - Bela Vista',
    city: 'São Paulo',
    lat: -23.5631,
    lng: -46.6545,
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: '4.7',
    isPublic: true,
    description: 'Oferece suporte primário, encaminhamentos médicos, acompanhamento psicológico e auxílio jurídico para retificação de nome social.'
  },
  {
    id: 'sp4',
    name: 'Casa Nem - Centro de Saúde',
    specialty: 'Acolhimento Integral LGBT+',
    address: 'Rua da Lapa, 120 - Lapa',
    city: 'Rio de Janeiro',
    lat: -22.9150,
    lng: -43.1770,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: '5.0',
    isPublic: false,
    description: 'Foco no acolhimento de pessoas trans em situação de vulnerabilidade, oferecendo desde atendimento médico básico até moradia e capacitação.'
  },
  {
    id: 'sp5',
    name: 'Ambulatório Municipal Casarão da Diversidade',
    specialty: 'Terapia Hormonal e Infectologia',
    address: 'Pelourinho, 12 - Centro Histórico',
    city: 'Salvador',
    lat: -12.9718,
    lng: -38.5076,
    image: 'https://images.unsplash.com/photo-1519494140681-8b17d76b8b80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: '4.6',
    isPublic: true,
    description: 'Principal equipamento público da Bahia especializado na saúde integral da população LGBTQIA+, com forte atuação em prevenção e infectologia.'
  }
];

export const INITIAL_TESTIMONIALS = {
  'f1': [
    { id: 1, name: 'Anônimo', rating: 5, text: 'A equipe de enfermagem foi muito respeitosa, me trataram pelo nome social o tempo todo.', date: '2023-10-01' },
    { id: 2, name: 'Maria', rating: 1, text: 'O médico foi invasivo com perguntas desnecessárias sobre meu corpo.', date: '2023-10-05' }
  ],
  'f2': [
    { id: 4, name: 'Alex', rating: 4, text: 'Lugar essencial. Todos são muito bem treinados para nos atender.', date: '2023-10-03' }
  ],
  'f3': [
    { id: 5, name: 'Camila', rating: 2, text: 'Fiquei horas esperando e a ficha preenchida não respeitava minha identidade.', date: '2023-10-04' }
  ],
  'f4': [
    { id: 6, name: 'João', rating: 5, text: 'Excelente atendimento humanizado. Me senti muito acolhido.', date: '2023-10-06' }
  ],
  'f5': [
    { id: 7, name: 'Luna', rating: 1, text: 'Fui maltratada na recepção, chamaram meu nome de registro em voz alta.', date: '2023-10-07' }
  ]
};
