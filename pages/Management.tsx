import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

interface StudentData {
  id: string;
  nome: string;
  nascimento: string;
  genero: string;
  nacionalidade: string;
  documentoId: string;
  nomePai: string;
  nomeMae: string;
  endereco: string;
  cidade: string;
  telefone: string;
  email: string;
  escolaAnterior: string;
  classe: string;
  cargo: string;
  alergias: string;
  medicamentos: string;
  tipoSanguineo: string;
  nomeEmergencia: string;
  telEmergencia: string;
  dataMatricula: string;
  status: string;
  sala: string;
  turma: string;
  turno: string;
  anoLetivo: string;
  pendenciaDoc?: string;
}

interface GenericArea {
  id: string;
  label: string;
  icon: string;
  expansive?: boolean;
}

interface ManagementAlert {
  id: string;
  type: 'urgent' | 'info' | 'warning';
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const INITIAL_PEDAGOGIC_AREAS: GenericArea[] = [
  { id: 'coord_curricular', label: 'Coordenação Curricular', icon: '🎯' },
  { id: 'formacoes', label: 'Formações', icon: '🎓' },
  { id: 'professores', label: 'Professores', icon: '👨‍🏫' },
  { id: 'classes_turmas', label: 'Classes & Turmas', icon: '👥', expansive: true },
  { id: 'aval_rendimento', label: 'Avaliação de Rendimento', icon: '📈' },
  { id: 'projetos_steam', label: 'Projetos STEAM', icon: '🔬' },
  { id: 'acomp_pedagogico', label: 'Acompanhamento Pedagógico', icon: '🧭' },
  { id: 'inclusao', label: 'Inclusão Escolar', icon: '🤝' },
  { id: 'manuais', label: 'Seleção de Manuais', icon: '📚' },
  { id: 'planos_ia', label: 'Planos de Aula IA', icon: '🤖' },
  { id: 'conselhos', label: 'Conselhos de Classe', icon: '🏛️' },
  { id: 'olimpiadas', label: 'Olimpíadas de Conhecimento', icon: '🏆' },
  { id: 'psicopedagogia', label: 'Psicopedagogia', icon: '🧠' },
  { id: 'escola_familia', label: 'Relação Escola-Família', icon: '🏠' },
  { id: 'inovacao', label: 'Inovação no Ensino', icon: '💡' },
  { id: 'tutoria', label: 'Tutoria de Alunos', icon: '👤' },
  { id: 'laboratorios', label: 'Laboratórios Práticos', icon: '🧪' },
  { id: 'calendario', label: 'Calendário Académico', icon: '📅' },
  { id: 'metodologias', label: 'Metodologias Ativas', icon: '⚡' },
  { id: 'certificacoes', label: 'Certificações', icon: '📜' },
  { id: 'campo', label: 'Saídas de Campo', icon: '🚌' },
];

const INITIAL_SCHOOL_DIRECTOR_AREAS: GenericArea[] = [
  { id: 'rep_legal', label: 'Representação Legal', icon: '⚖️' },
  { id: 'gestao_pessoal', label: 'Gestão do Pessoal', icon: '👥' },
  { id: 'orcamento', label: 'Orçamento', icon: '💰' },
  { id: 'plano_expansao', label: 'Plano de Expansão', icon: '🏗️' },
  { id: 'compliance', label: 'Compliance Normativo', icon: '📜' },
  { id: 'rel_institucionais', label: 'Relações Institucionais', icon: '🤝' },
  { id: 'lideranca', label: 'Liderança de Equipes', icon: '📣' },
  { id: 'gestao_ativos', label: 'Gestão de Ativos', icon: '🏛️' },
  { id: 'auditoria', label: 'Auditoria Interna', icon: '🔍' },
  { id: 'seguranca', label: 'Segurança Escolar', icon: '🛡️' },
  { id: 'manutencao', label: 'Manutenção Predial', icon: '🔧' },
  { id: 'marketing', label: 'Marketing Educacional', icon: '📢' },
  { id: 'retencao', label: 'Retenção de Alunos', icon: '🧲' },
  { id: 'investimentos', label: 'Captação de Investimentos', icon: '💎' },
  { id: 'cultura', label: 'Cultura Organizacional', icon: '✨' },
  { id: 'crises', label: 'Gestão de Crises', icon: '🚨' },
  { id: 'parcerias', label: 'Parcerias Estratégicas', icon: '🔗' },
  { id: 'obras', label: 'Acompanhamento de Obras', icon: '🚧' },
  { id: 'digitalizacao', label: 'Digitalização de Processos', icon: '💻' },
  { id: 'sustentabilidade', label: 'Sustentabilidade Financeira', icon: '💸' },
  { id: 'eventos_oficiais', label: 'Eventos Oficiais', icon: '🎟️' },
  { id: 'terceiros', label: 'Contratação de Terceiros', icon: '📝' },
  { id: 'suprimentos', label: 'Gestão de Suprimentos', icon: '📦' },
  { id: 'etica', label: 'Ética Institucional', icon: '🤝' },
  { id: 'relatorios_adm', label: 'Relatórios à Administração', icon: '📊' },
  { id: 'ouvidoria', label: 'Ouvidoria Geral', icon: '📞' },
  { id: 'inovacao_tec', label: 'Inovação Tecnológica', icon: '🚀' },
  { id: 'descontos', label: 'Políticas de Descontos', icon: '🏷️' },
  // Fixed: Removed 'role' property which is not defined in the GenericArea interface
  { id: 'carreira_rh', label: 'Plano de Carreira RH', icon: '📈' },
  { id: 'kpis', label: 'Monitoramento de KPIs', icon: '🎯' },
  { id: 'visao_2030', label: 'Visão 2030', icon: '🔭' },
];

const INITIAL_SECRETARY_AREAS = [
  { id: 'matriculas', label: 'Gestão de Matrículas', icon: '📝' },
  { id: 'arquivo', label: 'Arquivo Digital', icon: '📁' },
  { id: 'documentos', label: 'Diplomas, Certificações & Boletins', icon: '🎓' },
  { id: 'atendimento', label: 'Atendimento ao Público', icon: '👤' },
  { id: 'assiduidade', label: 'Controle de Assiduidade', icon: '📅' },
  { id: 'transferencias', label: 'Processos de Transferência', icon: '🔄' },
  { id: 'dossie', label: 'Dossiê do Aluno', icon: '📚' },
  { id: 'atividades', label: 'Editar Atividades', icon: '🎨' },
  { id: 'exames', label: 'Apoio a Exames', icon: '📝' },
  { id: 'correspondencia', label: 'Logística de Correspondência', icon: '✉️' },
  { id: 'sige', label: 'Cadastro SIGE/Governo', icon: '🏛️' },
  { id: 'vagas', label: 'Gestão de Vagas', icon: '🚪' },
  { id: 'protocolo', label: 'Protocolo de Documentos', icon: '📋' },
  { id: 'listas', label: 'Organização de Listas', icon: '📊' },
  { id: 'historico', label: 'Histórico Escolar', icon: '📜' },
  { id: 'financas', label: 'Gestão de Mensalidades', icon: '💰' },
  { id: 'comunicacao', label: 'Comunicação com Pais', icon: '📱' },
  { id: 'inventario', label: 'Inventário de Material', icon: '📦' },
  { id: 'pautas', label: 'Configurações de Pauta', icon: '✒️' },
  { id: 'estatisticas', label: 'Relatórios Estatísticos', icon: '📈' },
];

const ACADEMIC_CLASSES = [
  "Iniciação", 
  ...Array.from({length: 13}, (_, i) => `${i + 1}ª Classe`), 
  "Etapa 1", "Etapa 2", "Etapa 3",
  "Módulo 1", "Módulo 2", "Módulo 3"
];

const INITIAL_ACADEMIC_YEARS = ["2025", "2024", "2023", "2022", "2021", "2020"];

const Management: React.FC = () => {
  const { user, activeRole, setActiveRole, t } = useAppContext();
  const attachmentRef = useRef<HTMLInputElement>(null);
  const pedagogicFileRef = useRef<HTMLInputElement>(null);
  
  // Storage states
  const [students, setStudents] = useState<StudentData[]>(() => {
    const saved = localStorage.getItem('edu_students');
    // Seed data if empty to show alert system
    if (!saved || JSON.parse(saved).length === 0) {
      return [
        { id: 's1', nome: 'Ana Maria Ferreira', documentoId: '00123LA', status: 'Pendente', pendenciaDoc: 'Falta Cédula', classe: '1ª Classe', anoLetivo: '2025', turno: 'Manhã', cargo: 'Primário', nascimento: '2018-05-12' },
        { id: 's2', nome: 'Bruno Silva', documentoId: '00456LB', status: 'Ativo', classe: '1ª Classe', anoLetivo: '2025', turno: 'Manhã', cargo: 'Primário', nascimento: '2018-03-20' }
      ];
    }
    return JSON.parse(saved);
  });

  useEffect(() => {
    localStorage.setItem('edu_students', JSON.stringify(students));
  }, [students]);

  // UI States
  const [activeSecArea, setActiveSecArea] = useState<string | null>(null);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<StudentData | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [enrollmentForm, setEnrollmentForm] = useState<Partial<StudentData>>({
    status: 'Ativo',
    dataMatricula: new Date().toISOString().split('T')[0],
    classe: ACADEMIC_CLASSES[0],
    turma: 'Única',
    turno: 'Manhã',
    anoLetivo: '2025',
    cargo: 'Primário'
  });

  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [academicYears, setAcademicYears] = useState<string[]>(() => {
    const saved = localStorage.getItem('dossie_years');
    return saved ? JSON.parse(saved) : INITIAL_ACADEMIC_YEARS;
  });
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  // School Director views & states
  const [activeDirectorView, setActiveDirectorView] = useState<'hub' | 'reports'>('hub');
  const [isEditingDirectorLabels, setIsEditingDirectorLabels] = useState(false);
  const [schoolDirectorAreas, setSchoolDirectorAreas] = useState<GenericArea[]>(() => {
    const saved = localStorage.getItem('school_director_areas');
    return saved ? JSON.parse(saved) : INITIAL_SCHOOL_DIRECTOR_AREAS;
  });

  useEffect(() => {
    localStorage.setItem('school_director_areas', JSON.stringify(schoolDirectorAreas));
  }, [schoolDirectorAreas]);

  // Pedagogic specific states
  const [activePedagogicView, setActivePedagogicView] = useState<'hub' | 'reports' | string>('hub');
  const [pedagogicReport, setPedagogicReport] = useState<File | null>(null);
  const [isEditingPedagogicLabels, setIsEditingPedagogicLabels] = useState(false);
  const [pedagogicAreas, setPedagogicAreas] = useState<GenericArea[]>(() => {
    const saved = localStorage.getItem('pedagogic_areas');
    return saved ? JSON.parse(saved) : INITIAL_PEDAGOGIC_AREAS;
  });

  useEffect(() => {
    localStorage.setItem('pedagogic_areas', JSON.stringify(pedagogicAreas));
  }, [pedagogicAreas]);

  const [showModuleHub, setShowModuleHub] = useState(true);

  // Dynamic Alerts logic
  const roleAlerts = useMemo((): ManagementAlert[] => {
    const alerts: ManagementAlert[] = [];
    
    if (activeRole === UserRole.SECRETARIA) {
      const pendingStudents = students.filter(s => s.status === 'Pendente' || s.pendenciaDoc);
      if (pendingStudents.length > 0) {
        alerts.push({
          id: 'sec-pending-enrollments',
          type: 'urgent',
          message: `URGENTE: Existem ${pendingStudents.length} matrículas com documentação pendente ou status de validação incompleto.`,
          actionLabel: 'Verificar Pendências',
          onAction: () => setActiveSecArea('matriculas')
        });
      }
      alerts.push({
        id: 'sec-system-update',
        type: 'info',
        message: 'Lembrete: O backup dos dossiês digitais de 2024 deve ser concluído até sexta-feira.',
      });
    }

    if (activeRole === UserRole.DIRECTOR_ESCOLAR) {
      alerts.push({
        id: 'dir-financial-report',
        type: 'urgent',
        message: 'ATENÇÃO: Relatório de fechamento mensal ainda não foi assinado digitalmente.',
        actionLabel: 'Assinar Agora',
        onAction: () => setActiveDirectorView('reports')
      });
      alerts.push({
        id: 'dir-maintenance',
        type: 'warning',
        message: 'Chamado técnico aberto: Reparo urgente na infraestrutura de rede da ala C.',
      });
    }

    if (activeRole === UserRole.DIRECTOR_PEDAGOGICO) {
      alerts.push({
        id: 'ped-assessment',
        type: 'urgent',
        message: 'URGENTE: O plano de recuperação para alunos com rendimento crítico na 12ª Classe precisa de validação.',
      });
      alerts.push({
        id: 'ped-training',
        type: 'info',
        message: 'Nova jornada de formação continuada para professores disponível no portal.',
      });
    }

    if (activeRole === UserRole.ADMIN) {
      alerts.push({
        id: 'adm-security',
        type: 'urgent',
        message: 'ALERTA: Foram detectadas 3 tentativas de acesso malsucedidas na conta do Diretor Pedagógico.',
      });
    }

    return alerts;
  }, [activeRole, students]);

  // Helper to count alerts per role for the Hub Central
  const getAlertCountForRole = (role: UserRole) => {
    if (role === UserRole.SECRETARIA) return students.filter(s => s.status === 'Pendente' || s.pendenciaDoc).length;
    if (role === UserRole.DIRECTOR_ESCOLAR) return 1;
    if (role === UserRole.DIRECTOR_PEDAGOGICO) return 1;
    if (role === UserRole.ADMIN) return 1;
    return 0;
  };

  const environments = useMemo(() => {
    const getAllowedRoles = (role: UserRole): UserRole[] => {
      switch (role) {
        case UserRole.ADMIN: return Object.values(UserRole);
        case UserRole.DIRECTOR_ESCOLAR: return [UserRole.DIRECTOR_ESCOLAR, UserRole.DIRECTOR_PEDAGOGICO, UserRole.SECRETARIA, UserRole.FINANCA, UserRole.RH, UserRole.STUDENT, UserRole.COORDENADOR, UserRole.TEACHER, UserRole.VIGILANTE];
        default: return [role, UserRole.STUDENT];
      }
    };

    const ALL_ENVIRONMENTS = [
      { role: UserRole.ADMIN, label: 'Gestor', icon: '⚡', color: 'bg-slate-100', text: 'text-slate-600' },
      { role: UserRole.DIRECTOR_ESCOLAR, label: 'Dir. Escolar', icon: '🏫', color: 'bg-indigo-100', text: 'text-indigo-600' },
      { role: UserRole.DIRECTOR_PEDAGOGICO, label: 'Dir. Pedagógico', icon: '📖', color: 'bg-emerald-100', text: 'text-emerald-600' },
      { role: UserRole.SECRETARIA, label: 'Secretaria', icon: '📝', color: 'bg-rose-100', text: 'text-rose-600' },
      { role: UserRole.FINANCA, label: 'Finança', icon: '💰', color: 'bg-amber-100', text: 'text-amber-600' },
      { role: UserRole.RH, label: 'RH', icon: '👥', color: 'bg-blue-100', text: 'text-blue-600' },
      { role: UserRole.STUDENT, label: 'Aluno', icon: '🎓', color: 'bg-violet-100', text: 'text-violet-600' },
      { role: UserRole.COORDENADOR, label: 'Coord.', icon: '🧭', color: 'bg-cyan-100', text: 'text-cyan-600' },
      { role: UserRole.TEACHER, label: 'Professor', icon: '👨‍🏫', color: 'bg-orange-100', text: 'text-orange-600' },
      { role: UserRole.VIGILANTE, label: 'Vigilante', icon: '🛡️', color: 'bg-stone-100', text: 'text-stone-600' },
    ];

    const allowedRoles = user ? getAllowedRoles(user.role) : [];
    return ALL_ENVIRONMENTS.filter(env => allowedRoles.includes(env.role));
  }, [user]);

  const filteredStudents = useMemo(() => {
    if (!selectedYear || !selectedClass) return [];
    return students.filter(s => s.anoLetivo === selectedYear && s.classe === selectedClass);
  }, [students, selectedYear, selectedClass]);

  const handleSaveEnrollment = () => {
    if (!enrollmentForm.documentoId || !enrollmentForm.nome) {
      alert("Por favor, preencha o nome e o documento.");
      return;
    }
    if (editingStudentId) {
      setStudents(prev => prev.map(s => s.id === editingStudentId ? { ...s, ...(enrollmentForm as StudentData) } : s));
    } else {
      setStudents(prev => [{ ...enrollmentForm, id: Date.now().toString() } as StudentData, ...prev]);
    }
    setShowEnrollmentModal(false);
  };

  const handleAttachDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) alert(`Documento "${file.name}" anexado com sucesso ao dossiê do ano ${selectedYear || 'atual'}.`);
  };

  const handlePedagogicFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPedagogicReport(file);
    } else if (file) {
      alert("Por favor, anexe apenas arquivos no formato PDF.");
    }
  };

  const removePedagogicReport = () => {
    setPedagogicReport(null);
    if (pedagogicFileRef.current) pedagogicFileRef.current.value = '';
  };

  const updatePedagogicLabel = (id: string, newLabel: string) => {
    setPedagogicAreas(prev => prev.map(area => area.id === id ? { ...area, label: newLabel } : area));
  };

  const updateDirectorLabel = (id: string, newLabel: string) => {
    setSchoolDirectorAreas(prev => prev.map(area => area.id === id ? { ...area, label: newLabel } : area));
  };

  const renderAlerts = () => {
    if (roleAlerts.length === 0) return null;
    return (
      <div className="mb-10 space-y-3 animate-in fade-in slide-in-from-top-4 no-print">
        {roleAlerts.map(alert => (
          <div 
            key={alert.id} 
            className={`p-5 rounded-[24px] border-l-[12px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm transition-all
              ${alert.type === 'urgent' ? 'bg-rose-50 border-rose-500 text-rose-800' : 
                alert.type === 'warning' ? 'bg-amber-50 border-amber-500 text-amber-800' : 
                'bg-indigo-50 border-indigo-500 text-indigo-800'}`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">
                {alert.type === 'urgent' ? '🚨' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
              <p className="font-bold text-sm tracking-tight">{alert.message}</p>
            </div>
            {alert.actionLabel && (
              <button 
                onClick={alert.onAction}
                className={`px-6 py-2.5 rounded-xl font-black uppercase text-[10px] shadow-sm transition-all hover:scale-105 active:scale-95
                  ${alert.type === 'urgent' ? 'bg-rose-600 text-white' : 
                    alert.type === 'warning' ? 'bg-amber-600 text-white' : 
                    'bg-indigo-600 text-white'}`}
              >
                {alert.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStudentDetailsModal = () => {
    if (!viewingStudent) return null;
    return (
      <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md overflow-y-auto no-print">
        <div className="bg-white dark:bg-slate-900 w-full max-w-2xl p-10 rounded-[50px] shadow-2xl animate-in zoom-in-95 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-8 border-b pb-6">
            <h3 className="text-3xl font-black uppercase text-indigo-600">Dossiê do Aluno</h3>
            <button onClick={() => setShowDetailsModal(false)} className="text-2xl hover:rotate-90 transition-transform">✕</button>
          </div>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-1">Identificação Pessoal</p>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Nome Completo</span>
                  <span className="font-black text-slate-800 dark:text-white">{viewingStudent.nome}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">ID Documento</span>
                  <span className="font-mono text-sm text-indigo-600">{viewingStudent.documentoId}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Data de Nascimento</span>
                  <span className="font-bold">{viewingStudent.nascimento || 'Não informada'}</span>
                </div>
              </section>
              <section className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-1">Acadêmico & Nível</p>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Cargo (Nível)</span>
                  <span className="font-black text-emerald-600">{viewingStudent.cargo}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Classe / Ano</span>
                  <span className="font-bold">{viewingStudent.classe} • {viewingStudent.anoLetivo}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Turno / Status</span>
                  <span className="font-bold">{viewingStudent.turno} • <span className={`uppercase text-[10px] font-black px-2 py-0.5 rounded ${viewingStudent.status === 'Pendente' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>{viewingStudent.status}</span></span>
                </div>
              </section>
            </div>
            {viewingStudent.pendenciaDoc && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                 <p className="text-[10px] font-black text-rose-600 uppercase mb-1">Pendências Documentais</p>
                 <p className="text-sm font-bold text-rose-800">{viewingStudent.pendenciaDoc}</p>
              </div>
            )}
            <section className="space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-1">Contato & Residência</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Telefone</span>
                  <span className="font-bold">{viewingStudent.telefone || '(Sem fone)'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">E-mail</span>
                  <span className="font-bold">{viewingStudent.email || '(Sem e-mail)'}</span>
                </div>
              </div>
            </section>
          </div>
          <div className="mt-12">
            <button onClick={() => setShowDetailsModal(false)} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase text-xs">Fechar Dossiê</button>
          </div>
        </div>
      </div>
    );
  };

  const renderEnrollmentForm = () => (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md overflow-y-auto no-print">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl p-10 rounded-[50px] shadow-2xl animate-in zoom-in-95 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-8 border-b pb-6">
          <h3 className="text-3xl font-black uppercase text-indigo-600">{editingStudentId ? 'Editar Aluno' : 'Matrícula Inteligente'}</h3>
          <button onClick={() => setShowEnrollmentModal(false)} className="text-2xl hover:rotate-90 transition-transform">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-1">Identificação</p>
            <label className="block">
              <span className="text-xs font-bold text-slate-500">Nome Completo</span>
              <input className="w-full mt-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-indigo-100" value={enrollmentForm.nome || ''} onChange={e => setEnrollmentForm({...enrollmentForm, nome: e.target.value})} />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-bold text-slate-500">Documento ID</span>
                <input className="w-full mt-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold text-sm" value={enrollmentForm.documentoId || ''} onChange={e => setEnrollmentForm({...enrollmentForm, documentoId: e.target.value})} />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-slate-500">Nascimento</span>
                <input type="date" className="w-full mt-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold text-sm" value={enrollmentForm.nascimento || ''} onChange={e => setEnrollmentForm({...enrollmentForm, nascimento: e.target.value})} />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-bold text-slate-500">Pendência Documental (se houver)</span>
              <input className="w-full mt-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold text-sm" value={enrollmentForm.pendenciaDoc || ''} onChange={e => setEnrollmentForm({...enrollmentForm, pendenciaDoc: e.target.value})} placeholder="Ex: Falta cédula de nascimento" />
            </label>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-1">Contato e Alocação</p>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-bold text-slate-500">Telefone</span>
                <input type="tel" className="w-full mt-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold text-sm" value={enrollmentForm.telefone || ''} onChange={e => setEnrollmentForm({...enrollmentForm, telefone: e.target.value})} placeholder="+244..." />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-slate-500">E-mail</span>
                <input type="email" className="w-full mt-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold text-sm" value={enrollmentForm.email || ''} onChange={e => setEnrollmentForm({...enrollmentForm, email: e.target.value})} placeholder="estudante@edu.com" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-bold text-slate-500">Classe</span>
                <select className="w-full mt-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-sm" value={enrollmentForm.classe} onChange={e => setEnrollmentForm({...enrollmentForm, classe: e.target.value})}>
                  {ACADEMIC_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-bold text-slate-500">Turno</span>
                <select className="w-full mt-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-sm" value={enrollmentForm.turno} onChange={e => setEnrollmentForm({...enrollmentForm, turno: e.target.value})}>
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-bold text-slate-500">Cargo do Aluno (Nível)</span>
                <select 
                  className="w-full mt-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-sm" 
                  value={enrollmentForm.cargo || 'Primário'} 
                  onChange={e => setEnrollmentForm({...enrollmentForm, cargo: e.target.value})}
                >
                  <option value="Primário">Primário</option>
                  <option value="Secundário">Secundário</option>
                  <option value="Superior">Superior</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-bold text-slate-500">Status</span>
                <select 
                  className="w-full mt-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-sm" 
                  value={enrollmentForm.status || 'Ativo'} 
                  onChange={e => setEnrollmentForm({...enrollmentForm, status: e.target.value})}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Suspenso">Suspenso</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <button onClick={() => setShowEnrollmentModal(false)} className="flex-1 py-5 bg-slate-100 rounded-3xl font-black uppercase text-xs">Cancelar</button>
          <button onClick={handleSaveEnrollment} className="flex-1 py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase text-xs shadow-xl shadow-indigo-200">Finalizar Processo</button>
        </div>
      </div>
    </div>
  );

  const renderDossieContent = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 relative">
      <div className="absolute top-0 right-0 z-10 flex items-center gap-4">
        <input type="file" ref={attachmentRef} className="hidden" onChange={handleAttachDocument} />
        <button 
          onClick={() => attachmentRef.current?.click()}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-[28px] font-black uppercase text-[11px] shadow-2xl flex items-center gap-3 transition-all hover:scale-105 border-4 border-white dark:border-slate-800"
        >
          📎 Anexar Documento
        </button>
        <button onClick={() => setShowAddFolderModal(true)} className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-4xl font-black shadow-2xl border-4 border-white dark:border-slate-800 hover:scale-110 transition-transform">+</button>
      </div>

      <div className="flex items-center gap-3 text-xs font-black uppercase text-slate-400 tracking-widest mb-10">
        <button onClick={() => { setSelectedYear(null); setSelectedClass(null); }}>Dossiê Digital</button>
        {selectedYear && <><span>/</span><button onClick={() => setSelectedClass(null)} className="text-indigo-600">{selectedYear}</button></>}
        {selectedClass && <><span>/</span><span className="text-indigo-600">{selectedClass}</span></>}
      </div>

      {!selectedYear ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {academicYears.map(year => (
            <button key={year} onClick={() => setSelectedYear(year)} className="bg-white dark:bg-slate-900 p-12 rounded-[50px] border shadow-sm hover:shadow-xl transition-all flex flex-col items-center gap-6">
              <span className="text-7xl">📂</span>
              <span className="text-2xl font-black text-indigo-700">{year}</span>
            </button>
          ))}
        </div>
      ) : !selectedClass ? (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {ACADEMIC_CLASSES.map(cls => (
            <button key={cls} onClick={() => setSelectedClass(cls)} className="p-6 bg-white dark:bg-slate-900 rounded-[35px] border shadow-sm hover:border-indigo-400 transition-all text-[10px] font-black uppercase text-slate-700">
              {cls}
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[50px] border p-20 text-center shadow-sm">
           <h3 className="text-3xl font-black text-slate-800 dark:text-white uppercase">Documentos: {selectedClass} - {selectedYear}</h3>
           <p className="text-slate-500 mt-4 font-medium">Use o botão superior direito para adicionar novos arquivos a esta pasta.</p>
           <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {filteredStudents.map(s => (
                <div key={s.id} className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[30px] flex items-center gap-4 hover:bg-white transition-all border border-transparent hover:border-slate-100">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl">📄</div>
                   <div><p className="font-black text-xs text-slate-800 dark:text-white truncate">{s.nome}_Doc.pdf</p></div>
                </div>
              ))}
              {filteredStudents.length === 0 && <p className="col-span-full py-20 text-slate-400 font-bold uppercase opacity-30">Pasta Vazia</p>}
           </div>
        </div>
      )}
    </div>
  );

  const renderClassReport = () => (
    <div className="space-y-8 animate-in slide-in-from-right-10">
      <div className="no-print flex justify-between items-center mb-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveDirectorView('hub')} 
            className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-xl hover:scale-105 transition-transform"
          >
            ←
          </button>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">Central de Relatórios PDF</h2>
            <p className="text-slate-500 font-medium">Extração de dados pessoais e acadêmicos para arquivo físico e digital.</p>
          </div>
        </div>
        {selectedClass && (
          <button onClick={() => window.print()} className="bg-indigo-600 text-white px-10 py-5 rounded-[30px] font-black uppercase text-xs shadow-2xl flex items-center gap-3 hover:scale-105 transition-all">
            🖨️ Exportar Turma (PDF)
          </button>
        )}
      </div>

      {!selectedYear ? (
        <div className="no-print grid grid-cols-2 md:grid-cols-4 gap-8">
          {academicYears.map(year => (
            <button key={year} onClick={() => setSelectedYear(year)} className="bg-white dark:bg-slate-900 p-10 rounded-[45px] border shadow-sm flex flex-col items-center gap-4 hover:shadow-lg transition-all">
              <span className="text-5xl">📅</span>
              <span className="text-xl font-black text-indigo-600">{year}</span>
            </button>
          ))}
        </div>
      ) : !selectedClass ? (
        <div className="no-print grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="col-span-full mb-4">
             <button onClick={() => setSelectedYear(null)} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600">← Alterar Ano ({selectedYear})</button>
          </div>
          {ACADEMIC_CLASSES.map(cls => (
            <button key={cls} onClick={() => setSelectedClass(cls)} className="bg-white dark:bg-slate-900 p-6 rounded-[30px] border shadow-sm hover:border-indigo-400 transition-all text-[10px] font-black uppercase text-slate-700">
              {cls}
            </button>
          ))}
        </div>
      ) : (
        <div className="print-container bg-white p-12 rounded-[60px] border shadow-xl">
           <header className="flex justify-between items-start border-b-8 border-indigo-600 pb-12 mb-12">
             <div className="flex gap-8 items-center">
               <div className="w-24 h-24 bg-indigo-600 rounded-[35px] flex items-center justify-center text-5xl text-white font-black shadow-xl rotate-3">E</div>
               <div>
                 <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">EduSmart Pro - Academy</h1>
                 <p className="text-indigo-600 font-black text-sm uppercase tracking-[5px]">Relatório Executivo de Turma</p>
                 <div className="flex gap-4 mt-2">
                   <p className="text-[10px] font-black uppercase text-slate-400">Responsável: {user?.name}</p>
                   <p className="text-[10px] font-black uppercase text-slate-400">Data Emissão: {new Date().toLocaleDateString()}</p>
                 </div>
               </div>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-400">Classe / Ano</p>
                <p className="text-2xl font-black text-slate-900">{selectedClass}</p>
                <p className="text-indigo-600 font-black uppercase text-[12px]">{selectedYear}</p>
             </div>
           </header>
           
           <table className="w-full text-left">
              <thead>
                <tr className="border-b-4 border-slate-100">
                  <th className="py-6 text-[10px] font-black uppercase text-slate-400">Nº</th>
                  <th className="py-6 text-[10px] font-black uppercase text-slate-400">Estudante / Nascimento</th>
                  <th className="py-6 text-[10px] font-black uppercase text-slate-400">ID / Contato</th>
                  <th className="py-6 text-[10px] font-black uppercase text-slate-400">Status Geral</th>
                  <th className="py-6 text-[10px] font-black uppercase text-slate-400 text-right">Pendência Doc.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-bold uppercase">Nenhum registro encontrado nesta turma</td></tr>
                ) : (
                  filteredStudents.map((s, i) => (
                    <tr key={s.id}>
                      <td className="py-5 font-black text-slate-300">{(i+1).toString().padStart(2,'0')}</td>
                      <td className="py-5">
                        <p className="font-black text-slate-800">{s.nome}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{s.nascimento ? new Date(s.nascimento).toLocaleDateString() : 'N/A'}</p>
                      </td>
                      <td className="py-5">
                        <p className="font-mono text-xs text-slate-500 uppercase">{s.documentoId}</p>
                        <p className="text-[9px] text-slate-400 font-bold">{s.telefone || 'Sem contato'}</p>
                      </td>
                      <td className="py-5">
                        <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-md ${s.status === 'Pendente' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>{s.status}</span>
                      </td>
                      <td className="py-5 text-right">
                        <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-md ${s.pendenciaDoc ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {s.pendenciaDoc || 'Regularizado'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
           </table>
           
           <footer className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center text-slate-400 font-bold uppercase text-[9px]">
             <div className="flex gap-10">
               <div><p className="mb-8 opacity-50">Assinatura Digital Direção</p><div className="w-48 h-px bg-slate-200"></div></div>
               <div><p className="mb-8 opacity-50">Assinatura Digital Secretaria</p><div className="w-48 h-px bg-slate-200"></div></div>
             </div>
             <p>EduSmart Pro - Sistema Certificado v3.1</p>
           </footer>
        </div>
      )}
    </div>
  );

  const renderPedagogicReportsArea = () => (
    <div className="space-y-10 animate-in fade-in">
      <div className="flex justify-between items-center no-print">
        <button 
          onClick={() => setActivePedagogicView('hub')} 
          className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase shadow-sm border"
        >
          ← Voltar para Hub
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-12 rounded-[50px] border shadow-sm text-center">
        <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-inner">📊</div>
        <h2 className="text-3xl font-black uppercase text-slate-800 dark:text-white tracking-tighter">Relatórios Oficiais</h2>
        
        <div className="mt-12 max-w-2xl mx-auto p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-700 relative">
          <input 
            type="file" 
            ref={pedagogicFileRef} 
            className="hidden" 
            accept="application/pdf"
            onChange={handlePedagogicFileChange}
          />

          {!pedagogicReport ? (
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-3xl shadow-sm">📂</div>
              <p className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase">Nenhum relatório anexado</p>
              <button 
                onClick={() => pedagogicFileRef.current?.click()}
                className="px-10 py-4 bg-emerald-600 text-white rounded-3xl font-black uppercase text-[10px] shadow-xl hover:scale-105 transition-transform"
              >
                📁 Anexar Relatório PDF
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 animate-in zoom-in-95">
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-4xl shadow-sm">📄</div>
              <div className="text-center">
                <p className="text-sm font-black text-emerald-600 uppercase">Relatório Selecionado</p>
                <p className="text-[12px] text-slate-700 dark:text-slate-200 font-black mt-1">{pedagogicReport.name}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={removePedagogicReport} className="px-8 py-4 bg-rose-100 text-rose-600 rounded-2xl font-black uppercase text-[10px]">🗑️ Remover</button>
                <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px]">✅ Enviar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderModuleHub = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 animate-in fade-in slide-in-from-bottom-8 no-print">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-4">Central de Ambientes</h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-[4px]">Selecione a área de atuação para iniciar a gestão</p>
      </div>
      
      {renderAlerts()}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full max-w-6xl">
        {environments.map(env => {
          const alertCount = getAlertCountForRole(env.role);
          return (
            <button 
              key={env.role} 
              onClick={() => { setActiveRole(env.role); setShowModuleHub(false); }} 
              className="group relative bg-white dark:bg-slate-900 p-10 rounded-[55px] shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-indigo-400 flex flex-col items-center gap-8 transition-all hover:-translate-y-4"
            >
              {alertCount > 0 && (
                <div className="absolute top-6 left-6 w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] font-black border-4 border-white dark:border-slate-900 animate-pulse z-10">
                  {alertCount}
                </div>
              )}
              <div className={`w-24 h-24 ${env.color} rounded-[40px] flex items-center justify-center text-5xl shadow-lg group-hover:rotate-6 transition-transform`}>
                {env.icon}
              </div>
              <div className="text-center">
                <h3 className={`text-sm font-black uppercase ${env.text} tracking-wider`}>{env.label}</h3>
                <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase opacity-60">Acessar Ambiente</p>
              </div>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-indigo-400">⚡</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderRoleDashboard = () => {
    switch (activeRole) {
      case UserRole.SECRETARIA:
        return activeSecArea ? (
          <div className="space-y-8 no-print">
            <button onClick={() => setActiveSecArea(null)} className="px-6 py-3 bg-slate-100 rounded-2xl text-[10px] font-black uppercase border">← Painel Secretaria</button>
            {activeSecArea === 'matriculas' ? (
              <div className="space-y-8 animate-in slide-in-from-right-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-black uppercase text-slate-800 dark:text-white">Matrículas & Pendências</h2>
                  <button onClick={() => { setEditingStudentId(null); setEnrollmentForm({ status: 'Ativo', dataMatricula: new Date().toISOString().split('T')[0], classe: ACADEMIC_CLASSES[0], turma: 'Única', turno: 'Manhã', anoLetivo: '2025', cargo: 'Primário' }); setShowEnrollmentModal(true); }} className="bg-indigo-600 text-white px-8 py-4 rounded-[28px] font-black uppercase text-xs shadow-xl">+ Nova Matrícula</button>
                </div>
                {renderAlerts()}
                <div className="bg-white dark:bg-slate-900 rounded-[40px] border shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50"><tr><th className="px-6 py-4 text-[10px] font-black text-slate-400">ALUNO / STATUS</th><th className="px-6 py-4 text-[10px] font-black text-slate-400">CONTATO / PENDÊNCIA</th><th className="px-6 py-4 text-[10px] font-black text-slate-400 text-right">AÇÕES</th></tr></thead>
                    <tbody className="divide-y">
                      {students.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-black text-sm">{s.nome}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-[10px] text-indigo-500 font-bold uppercase">{s.cargo} • {s.classe}</p>
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${s.status === 'Pendente' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>{s.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs font-bold text-slate-600">{s.telefone || '(Sem fone)'}</p>
                            {s.pendenciaDoc && <p className="text-[9px] text-rose-500 font-black uppercase mt-1 italic">⚠️ {s.pendenciaDoc}</p>}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => { setViewingStudent(s); setShowDetailsModal(true); }} 
                                title="Visualizar Detalhes"
                                className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors"
                              >
                                👁️
                              </button>
                              <button 
                                onClick={() => { setEditingStudentId(s.id); setEnrollmentForm(s); setShowEnrollmentModal(true); }} 
                                title="Editar Cadastro"
                                className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-100 transition-colors"
                              >
                                ✏️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeSecArea === 'dossie' ? renderDossieContent() : <div className="py-20 text-center opacity-30">Área em Integração...</div>}
          </div>
        ) : (
          <div className="space-y-8 no-print">
            {renderAlerts()}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {INITIAL_SECRETARY_AREAS.map(area => (
                <button key={area.id} onClick={() => setActiveSecArea(area.id)} className="w-full h-44 bg-white dark:bg-slate-900 rounded-[45px] p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all">
                  <span className="text-5xl">{area.icon}</span><span className="text-[11px] font-black uppercase text-slate-700 dark:text-white text-center">{area.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case UserRole.DIRECTOR_ESCOLAR:
        if (activeDirectorView === 'reports') return renderClassReport();
        
        return (
          <div className="space-y-10 animate-in fade-in no-print">
            <header className="flex flex-col sm:flex-row justify-between items-center p-10 bg-white dark:bg-slate-900 rounded-[45px] border-2 border-indigo-50 shadow-sm gap-6">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Direção Executiva</h2>
                <p className="text-indigo-500 font-black text-xs uppercase tracking-widest mt-1">Liderança Estratégica & Gestão de Ativos</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsEditingDirectorLabels(!isEditingDirectorLabels)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-black uppercase text-[10px] transition-all shadow-lg ${isEditingDirectorLabels ? 'bg-amber-100 text-amber-700 border-2 border-amber-500' : 'bg-slate-900 text-white'}`}
                >
                  {isEditingDirectorLabels ? '💾 Salvar Nomes' : '⚙️ Modo Edição'}
                </button>
              </div>
            </header>

            {renderAlerts()}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
              {schoolDirectorAreas.map((area) => (
                <div 
                  key={area.id} 
                  className={`group relative bg-white dark:bg-slate-900 p-8 rounded-[40px] border-2 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden flex flex-col items-center text-center justify-between ${isEditingDirectorLabels ? 'border-amber-400 bg-amber-50/10' : 'border-slate-50 dark:border-slate-800 hover:border-indigo-200'}`}
                >
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-inner group-hover:rotate-6 transition-transform">
                    {area.icon}
                  </div>
                  
                  {isEditingDirectorLabels ? (
                    <input 
                      className="w-full text-center bg-white dark:bg-slate-800 p-2 rounded-lg text-[10px] font-black uppercase text-indigo-600 border border-indigo-100 outline-none"
                      value={area.label}
                      onChange={(e) => updateDirectorLabel(area.id, e.target.value)}
                    />
                  ) : (
                    <button 
                      onClick={() => area.id === 'relatorios_adm' ? setActiveDirectorView('reports') : null}
                      className="w-full"
                    >
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-100 leading-tight">
                        {area.label}
                      </h3>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case UserRole.DIRECTOR_PEDAGOGICO:
        if (activePedagogicView === 'reports') return renderPedagogicReportsArea();
        
        return (
          <div className="space-y-10 animate-in fade-in">
            <header className="flex justify-between items-center p-8 bg-white dark:bg-slate-900 rounded-[40px] border shadow-sm">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">Direção Pedagógica</h2>
                <p className="text-slate-500 font-medium">Gestão curricular, supervisão e inovação no ensino.</p>
              </div>
              <button 
                onClick={() => setIsEditingPedagogicLabels(!isEditingPedagogicLabels)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black uppercase text-[10px] transition-all ${isEditingPedagogicLabels ? 'bg-amber-100 text-amber-600 border-2 border-amber-500' : 'bg-slate-100 text-slate-500 border border-transparent'}`}
              >
                {isEditingPedagogicLabels ? '💾 Salvar Nomes' : '✏️ Editar Botões'}
              </button>
            </header>

            {renderAlerts()}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {pedagogicAreas.map((area) => (
                <div 
                  key={area.id} 
                  className={`group relative bg-white dark:bg-slate-900 p-8 rounded-[40px] border-2 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden ${area.expansive ? 'lg:col-span-2' : ''} ${isEditingPedagogicLabels ? 'border-amber-400 ring-4 ring-amber-50' : 'border-slate-50 dark:border-slate-800 hover:border-emerald-100'}`}
                >
                  <div className="flex flex-col items-center gap-6 h-full justify-between">
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950 rounded-3xl flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
                      {area.icon}
                    </div>
                    
                    {isEditingPedagogicLabels ? (
                      <input 
                        className="w-full text-center bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs font-black uppercase text-indigo-600 border-2 border-indigo-100 outline-none"
                        value={area.label}
                        onChange={(e) => updatePedagogicLabel(area.id, e.target.value)}
                        placeholder="Nome da Área"
                      />
                    ) : (
                      <button 
                        onClick={() => area.id === 'aval_rendimento' ? setActivePedagogicView('reports') : null}
                        className="w-full text-center"
                      >
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 leading-tight">
                          {area.label}
                        </h3>
                        <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase">Acessar Módulo</p>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default: return (
        <div className="py-10">
          {renderAlerts()}
          <div className="py-40 text-center font-black uppercase opacity-20 text-4xl">Painel EduSmart {activeRole}</div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto pb-12 relative min-h-[80vh]">
      <header className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-slate-900 p-8 rounded-[45px] shadow-sm border border-slate-50 mb-12 gap-6 no-print">
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 ${environments.find(e => e.role === activeRole)?.color || 'bg-indigo-600'} rounded-[30px] flex items-center justify-center text-3xl text-white shadow-xl rotate-3 font-black`}>
            {environments.find(e => e.role === activeRole)?.icon || 'E'}
          </div>
          <div><h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Gestão: {showModuleHub ? 'Hub Central' : environments.find(e => e.role === activeRole)?.label}</h1><p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{user?.name} • Portal Administrativo</p></div>
        </div>
        {!showModuleHub && <button onClick={() => setShowModuleHub(true)} className="px-8 py-4 bg-slate-900 text-white rounded-full text-xs font-black uppercase shadow-lg transition-transform hover:scale-105 active:scale-95">⚡ Alternar Ambiente</button>}
      </header>

      {showModuleHub ? renderModuleHub() : renderRoleDashboard()}
      {showEnrollmentModal && renderEnrollmentForm()}
      {showDetailsModal && renderStudentDetailsModal()}

      {showAddFolderModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm no-print">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md p-10 rounded-[40px] shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-black uppercase mb-6 text-slate-800 dark:text-white">Nova Pasta Ano</h3>
            <input autoFocus className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold border-2 border-transparent focus:border-indigo-500 outline-none" placeholder="Ex: 2026" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} />
            <div className="flex gap-4 mt-10">
              <button onClick={() => setShowAddFolderModal(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black uppercase text-xs">Cancelar</button>
              <button onClick={() => { if(!newFolderName) return; setAcademicYears([newFolderName, ...academicYears]); setShowAddFolderModal(false); setNewFolderName(''); }} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs">Criar</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-container, .print-container * { visibility: visible; }
          .print-container { position: absolute; left: 0; top: 0; width: 100%; border: none !important; box-shadow: none !important; }
          .no-print { display: none !important; }
          header, footer { border-color: #4f46e5 !important; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Management;