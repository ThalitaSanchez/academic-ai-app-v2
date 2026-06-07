export const sharedSubjects = [
  { id: 'anatomia', name: 'Anatomia', icon: '🦴' },
  { id: 'histologia', name: 'Histologia', icon: '🔬' },
  { id: 'bioquimica', name: 'Bioquímica', icon: '🧬' },
  { id: 'microbiologia', name: 'Microbiologia', icon: '🦠' },
  { id: 'fisiologia', name: 'Fisiologia', icon: '❤️' },
  { id: 'farmacologia', name: 'Farmacologia', icon: '💊' },
  { id: 'patologia', name: 'Patologia', icon: '🧫' },
]

export const radiologyShared = [
  { id: 'fisica-radiacoes', name: 'Física das Radiações', icon: '⚛️' },
  { id: 'protecao-radiologica', name: 'Proteção Radiológica', icon: '🛡️' },
  { id: 'tecnicas-radiograficas', name: 'Técnicas Radiográficas', icon: '🩻' },
  { id: 'equipamentos', name: 'Equipamentos de Imagem', icon: '🖥️' },
]

export const courses: Record<string, { name: string; icon: string; specific: { id: string; name: string; icon: string }[] }> = {
  biomedicina: {
    name: 'Biomedicina',
    icon: '🧬',
    specific: [
      { id: 'analises-clinicas', name: 'Análises Clínicas', icon: '🔬' },
      { id: 'hematologia', name: 'Hematologia', icon: '🩸' },
      { id: 'radiologia', name: 'Radiologia', icon: '🩻' },
      { id: 'imunologia', name: 'Imunologia', icon: '🛡️' },
    ],
  },
  medicina: {
    name: 'Medicina',
    icon: '🩺',
    specific: [
      { id: 'clinica-medica', name: 'Clínica Médica', icon: '🏥' },
      { id: 'cirurgia', name: 'Cirurgia', icon: '🔪' },
      { id: 'radiologia', name: 'Radiologia', icon: '🩻' },
      { id: 'pediatria', name: 'Pediatria', icon: '👶' },
    ],
  },
  radiologia: {
    name: 'Tecnólogo em Radiologia',
    icon: '🩻',
    specific: [
      { id: 'tomografia', name: 'Tomografia Computadorizada', icon: '🖥️' },
      { id: 'ressonancia', name: 'Ressonância Magnética', icon: '🧲' },
      { id: 'ultrassonografia', name: 'Ultrassonografia', icon: '📡' },
      { id: 'medicina-nuclear', name: 'Medicina Nuclear', icon: '☢️' },
    ],
  },
  enfermagem: {
    name: 'Enfermagem',
    icon: '💉',
    specific: [
      { id: 'semiologia', name: 'Semiologia', icon: '📋' },
      { id: 'saude-publica', name: 'Saúde Pública', icon: '🏥' },
      { id: 'cuidados-intensivos', name: 'Cuidados Intensivos', icon: '❤️' },
    ],
  },
  farmacia: {
    name: 'Farmácia',
    icon: '💊',
    specific: [
      { id: 'farmacotecnica', name: 'Farmacotécnica', icon: '⚗️' },
      { id: 'toxicologia', name: 'Toxicologia', icon: '☠️' },
      { id: 'cosmetologia', name: 'Cosmetologia', icon: '🧴' },
    ],
  },
  quimica: {
    name: 'Química',
    icon: '⚗️',
    specific: [
      { id: 'quimica-organica', name: 'Química Orgânica', icon: '🔗' },
      { id: 'quimica-analitica', name: 'Química Analítica', icon: '📊' },
      { id: 'quimica-industrial', name: 'Química Industrial', icon: '🏭' },
    ],
  },
}

export const assessmentThresholds = [30, 60, 100]