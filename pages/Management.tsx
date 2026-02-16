
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
  mediaGlobal?: number;
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

const ACADEMIC_CLASSES = [
  "Iniciação", 
  ...Array.from({length: 13}, (_, i) => `${i + 1}ª Classe`), 
  "Etapa 1", "Etapa 2", "Etapa 3",
  "Módulo 1", "Módulo 2", "Módulo 3"
];

// Helper to get dynamic turmas
const getTurmasForClass = (classe: string): string[] => {
  if (classe === "Iniciação") {
    return ["Pequenos Exploradores", "Jardim A", "Jardim B", "Pré-Escolar 1"];
  }
  
  const classNum = parseInt(classe);
  if (!isNaN(classNum)) {
    if (classNum >= 1 && classNum <= 9) {
      return ["Turma A", "Turma B", "Turma C", "Turma D"];
    }
    if (classNum >= 10) {
      return ["Sala 01", "Sala 02", "Sala 12", "Sala 15", "Técnico A", "Técnico B"];
    }
  }

  if (classe.includes("Etapa") || classe.includes("Módulo")) {
    return ["Turma Única", "Regime Especial", "Pós-Laboral A", "Pós-Laboral B"];
  }

  return ["Única"];
};

const INITIAL_ACADEMIC_YEARS = ["2025", "2024", "2023", "2022", "2021", "2020"];

// Added missing INITIAL_SECRETARY_AREAS constant to fix reference error
const INITIAL_SECRETARY_AREAS: GenericArea[] = [
  { id: 'matriculas', label: 'Matrículas', icon: '📝' },
  { id: 'processos', label: 'Processos', icon: '📁' },
  { id: 'certificados', label: 'Certificados', icon: '📜' },
  { id: 'horarios', label: 'Horários', icon: '📅' },
  { id: 'pautas', label: 'Pautas', icon: '📈' },
];

const Management: React.FC = () => {
  const { user, activeRole, setActiveRole, t } = useAppContext();
  
  // Storage states
  const [students, setStudents] = useState<StudentData[]>(() => {
    const saved = localStorage.getItem('edu_students');
    if (!saved || JSON.parse(saved).length === 0) {
      return [
        // Fixed duplicate property 'cargo' on lines 93 and 94
        { id: 's1', nome: 'Baltazar Gongo', documentoId: '00123LA', status: 'Ativo', classe: '2ª Classe', anoLetivo: '2025', turno: 'Manhã', cargo: 'Primário', nascimento: '2018-05-12', mediaGlobal: 9.8, turma: 'Turma A', genero: 'M', nacionalidade: 'Angolana', nomePai: 'Pai Gongo', nomeMae: 'Mãe Gongo', endereco: 'Rua 1', cidade: 'Luanda', telefone: '923000000', email: 'b@g.com', escolaAnterior: 'Escola A', alergias: 'Nenhuma', medicamentos: 'Nenhum', tipoSanguineo: 'A+', nomeEmergencia: 'Pai', telEmergencia: '923000001', dataMatricula: '2025-01-01', sala: '01' },
        { id: 's4', nome: 'Daniel Oliveira', documentoId: '00101LD', status: 'Ativo', classe: '12ª Classe', anoLetivo: '2025', turno: 'Manhã', cargo: 'Secundário', nascimento: '2007-01-10', mediaGlobal: 9.7, turma: 'Sala 01', genero: 'M', nacionalidade: 'Angolana', nomePai: 'Pai O', nomeMae: 'Mãe O', endereco: 'Rua 2', cidade: 'Luanda', telefone: '923000002', email: 'd@o.com', escolaAnterior: 'Escola B', alergias: 'Nenhuma', medicamentos: 'Nenhum', tipoSanguineo: 'O+', nomeEmergencia: 'Mãe', telEmergencia: '923000003', dataMatricula: '2025-01-01', sala: '12' }
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
  const [enrollmentForm, setEnrollmentForm] = useState<Partial<StudentData>>({
    nome: '',
    nascimento: '',
    documentoId: '',
    status: 'Ativo',
    dataMatricula: new Date().toISOString().split('T')[0],
    classe: ACADEMIC_CLASSES[0],
    turma: getTurmasForClass(ACADEMIC_CLASSES[0])[0],
    turno: 'Manhã',
    anoLetivo: '2025',
    cargo: 'Primário'
  });

  const availableTurmas = useMemo(() => {
    return getTurmasForClass(enrollmentForm.classe || ACADEMIC_CLASSES[0]);
  }, [enrollmentForm.classe]);

  // Sync turma when class changes
  useEffect(() => {
    if (availableTurmas.length > 0 && !availableTurmas.includes(enrollmentForm.turma || '')) {
      setEnrollmentForm(prev => ({ ...prev, turma: availableTurmas[0] }));
    }
  }, [availableTurmas]);

  const handleEnrollmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: StudentData = {
      ...(enrollmentForm as StudentData),
      id: Math.random().toString(36).substr(2, 9),
      mediaGlobal: 0
    };
    setStudents(prev => [...prev, newStudent]);
    setShowEnrollmentModal(false);
    alert('Matrícula realizada com sucesso!');
  };

  const [showModuleHub, setShowModuleHub] = useState(true);

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

  const renderModuleHub = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 animate-in fade-in slide-in-from-bottom-8 no-print">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-4">Central de Ambientes</h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-[4px]">Selecione a área de atuação para iniciar a gestão</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full max-w-6xl">
        {environments.map(env => (
          <button 
            key={env.role} 
            onClick={() => { setActiveRole(env.role); setShowModuleHub(false); }} 
            className="group relative bg-white dark:bg-slate-900 p-10 rounded-[55px] shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-indigo-400 flex flex-col items-center gap-8 transition-all hover:-translate-y-4"
          >
            <div className={`w-24 h-24 ${env.color} rounded-[40px] flex items-center justify-center text-5xl shadow-lg group-hover:rotate-6 transition-transform`}>
              {env.icon}
            </div>
            <div className="text-center">
              <h3 className={`text-sm font-black uppercase ${env.text} tracking-wider`}>{env.label}</h3>
              <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase opacity-60">Acessar Ambiente</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderRoleDashboard = () => {
    switch (activeRole) {
      case UserRole.TEACHER:
        return (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-black text-slate-800 uppercase">Diário de Classe</h2>
            <p className="text-slate-500 mt-2">Ambiente configurado para gestão de notas e presenças.</p>
          </div>
        );
      case UserRole.SECRETARIA:
        return activeSecArea ? (
          <div className="space-y-8 no-print">
            <button onClick={() => setActiveSecArea(null)} className="px-6 py-3 bg-slate-100 rounded-2xl text-[10px] font-black uppercase border">← Painel Secretaria</button>
            {activeSecArea === 'matriculas' ? (
              <div className="space-y-8 animate-in slide-in-from-right-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-black uppercase text-slate-800 dark:text-white">Matrículas Ativas</h2>
                  <button onClick={() => setShowEnrollmentModal(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-[28px] font-black uppercase text-xs shadow-xl shadow-indigo-100">+ Nova Matrícula Inteligente</button>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[40px] border shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ALUNO / ID</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">CLASSE / TURMA</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {students.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-6">
                            <p className="font-black text-sm text-slate-800">{s.nome}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{s.documentoId}</p>
                          </td>
                          <td className="px-6 py-6">
                            <p className="font-black text-sm text-indigo-600 uppercase">{s.classe}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{s.turma}</p>
                          </td>
                          <td className="px-6 py-6">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase rounded-full">{s.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : <div className="py-20 text-center opacity-30">Área em Integração...</div>}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {INITIAL_SECRETARY_AREAS.map(area => (
              <button key={area.id} onClick={() => setActiveSecArea(area.id)} className="w-full h-44 bg-white dark:bg-slate-900 rounded-[45px] p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-4 hover:shadow-xl transition-all">
                <span className="text-5xl">{area.icon}</span><span className="text-[11px] font-black uppercase text-slate-700 dark:text-white text-center">{area.label}</span>
              </button>
            ))}
          </div>
        );
      default: return (
        <div className="py-40 text-center font-black uppercase opacity-20 text-4xl">Painel EduSmart {activeRole}</div>
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

      {/* MODAL DE MATRÍCULA DINÂMICO */}
      {showEnrollmentModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md no-print">
          <div className="bg-white p-12 rounded-[50px] w-full max-w-2xl animate-in zoom-in-95 shadow-2xl relative">
             <button onClick={() => setShowEnrollmentModal(false)} className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">✕</button>
             
             <div className="mb-10">
               <h3 className="text-3xl font-black uppercase text-indigo-600 tracking-tighter">Matrícula Inteligente</h3>
               <p className="text-slate-400 text-xs font-bold uppercase mt-1 tracking-widest">Preencha os dados do novo estudante</p>
             </div>

             <form onSubmit={handleEnrollmentSubmit} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                    <input 
                      type="text" 
                      required
                      value={enrollmentForm.nome}
                      onChange={e => setEnrollmentForm({...enrollmentForm, nome: e.target.value})}
                      placeholder="Ex: Manuel dos Santos"
                      className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white p-5 rounded-[24px] outline-none font-bold text-slate-700 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data de Nascimento</label>
                    <input 
                      type="date" 
                      required
                      value={enrollmentForm.nascimento}
                      onChange={e => setEnrollmentForm({...enrollmentForm, nascimento: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white p-5 rounded-[24px] outline-none font-bold text-slate-700 transition-all"
                    />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Documento ID / BI</label>
                    <input 
                      type="text" 
                      required
                      value={enrollmentForm.documentoId}
                      onChange={e => setEnrollmentForm({...enrollmentForm, documentoId: e.target.value})}
                      placeholder="00123456LA042"
                      className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white p-5 rounded-[24px] outline-none font-bold text-slate-700 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classe de Ingresso</label>
                    <select 
                      value={enrollmentForm.classe}
                      onChange={e => setEnrollmentForm({...enrollmentForm, classe: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white p-5 rounded-[24px] outline-none font-bold text-slate-700 transition-all appearance-none"
                    >
                      {ACADEMIC_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Turma (Sugestão Dinâmica)</label>
                    <select 
                      value={enrollmentForm.turma}
                      onChange={e => setEnrollmentForm({...enrollmentForm, turma: e.target.value})}
                      className="w-full bg-indigo-50 border-2 border-indigo-100 focus:border-indigo-400 focus:bg-white p-5 rounded-[24px] outline-none font-bold text-indigo-700 transition-all appearance-none"
                    >
                      {availableTurmas.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Turno</label>
                    <select 
                      value={enrollmentForm.turno}
                      onChange={e => setEnrollmentForm({...enrollmentForm, turno: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white p-5 rounded-[24px] outline-none font-bold text-slate-700 transition-all appearance-none"
                    >
                      <option value="Manhã">Período da Manhã</option>
                      <option value="Tarde">Período da Tarde</option>
                      <option value="Noite">Período da Noite</option>
                    </select>
                  </div>
               </div>

               <div className="pt-6">
                  <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-[28px] font-black uppercase text-sm shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all">
                    Finalizar Matrícula & Gerar Processo
                  </button>
               </div>
             </form>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Management;
