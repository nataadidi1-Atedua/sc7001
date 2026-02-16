
import React, { useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    theme, t, user, activeRole, setActiveRole, toggleTheme, logout,
    fontSize, setFontSize, fontFamily, setFontFamily, bgColor, setBgColor
  } = useAppContext();

  const fontFamilies = [
    'Inter, sans-serif', 'Roboto, sans-serif', 'Open Sans, sans-serif', 'Montserrat, sans-serif', 
    'Lato, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Merriweather, serif', 
    'Oswald, sans-serif', 'Raleway, sans-serif', 'Ubuntu, sans-serif', 'Nunito, sans-serif', 
    'Rubik, sans-serif', 'Lora, serif', 'Quicksand, sans-serif', 'Josefin Sans, sans-serif', 
    'Titillium Web, sans-serif', 'Mukta, sans-serif', 'Arvo, serif', 'Cabin, sans-serif'
  ];

  const bgColors = [
    { name: 'Slate', class: 'bg-slate-50' },
    { name: 'Blue', class: 'bg-blue-50' },
    { name: 'Emerald', class: 'bg-emerald-50' },
    { name: 'Rose', class: 'bg-rose-50' }, 
    { name: 'Amber', class: 'bg-amber-50' },
    { name: 'Indigo', class: 'bg-indigo-50' },
    { name: 'Violet', class: 'bg-violet-50' },
    { name: 'Cyan', class: 'bg-cyan-50' }
  ];

  const fontSizes = [
    { label: 'Pequeno', value: '12px' },
    { label: 'Normal', value: '16px' },
    { label: 'Médio', value: '18px' },
    { label: 'Grande', value: '20px' },
    { label: 'Extra', value: '24px' }
  ];

  const getAllowedRoles = (role: UserRole): UserRole[] => {
    switch (role) {
      case UserRole.ADMIN: return Object.values(UserRole);
      case UserRole.DIRECTOR_ESCOLAR: return [UserRole.DIRECTOR_ESCOLAR, UserRole.DIRECTOR_PEDAGOGICO, UserRole.SECRETARIA, UserRole.FINANCA, UserRole.RH, UserRole.STUDENT, UserRole.COORDENADOR, UserRole.TEACHER, UserRole.VIGILANTE];
      default: return [role, UserRole.STUDENT];
    }
  };

  const allowedRoles = user ? getAllowedRoles(user.role) : [];
  const systemAreas = [
    { role: UserRole.ADMIN, label: 'Gestor' },
    { role: UserRole.DIRECTOR_ESCOLAR, label: 'Dir. Escolar' },
    { role: UserRole.DIRECTOR_PEDAGOGICO, label: 'Dir. Pedagógico' },
    { role: UserRole.SECRETARIA, label: 'Secretaria' },
    { role: UserRole.FINANCA, label: 'Finança' },
    { role: UserRole.RH, label: 'RH' },
    { role: UserRole.STUDENT, label: 'Aluno' },
    { role: UserRole.COORDENADOR, label: 'Coord.' },
    { role: UserRole.TEACHER, label: 'Professor' },
    { role: UserRole.VIGILANTE, label: 'Vigilante' },
  ].filter(area => allowedRoles.includes(area.role));

  const navItems = [
    { path: '/', label: t.dashboard, icon: '📊' },
    { path: '/ai-tutor', label: t.aiTutor, icon: '🤖' },
    { path: '/gestao', label: t.management, icon: '🏢' }
  ];

  return (
    <div className={`min-h-screen flex flex-col md:flex-row overflow-hidden transition-colors duration-300 no-print`}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-indigo-700 dark:bg-indigo-950 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:flex md:flex-col`}>
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">EduSmart</h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-2xl">✕</button>
        </div>
        <nav className="flex-1 mt-6 overflow-y-auto custom-scrollbar px-6">
          <div className="space-y-1 mb-8">
            {navItems.map((item) => (
              <button key={item.path} onClick={() => { navigate(item.path); setSidebarOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all text-left ${location.pathname === item.path ? 'bg-white/20' : 'hover:bg-white/5'}`}>
                <span className="mr-3 text-xl">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </div>
          <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-4">Ambientes</p>
          <div className="space-y-2">
            {systemAreas.map((area) => (
              <Link 
                key={area.role} 
                to="/gestao"
                onClick={() => { setActiveRole(area.role); setSidebarOpen(false); }} 
                className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all text-left text-xs font-bold border ${activeRole === area.role ? 'bg-white text-indigo-700' : 'bg-transparent border-indigo-600/30 text-indigo-200'}`}
              >
                {area.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="p-6 border-t border-indigo-600">
          <button onClick={() => setIsSettingsOpen(true)} className="w-full flex items-center gap-3 py-2 text-sm font-bold opacity-80 hover:opacity-100">
             <span>⚙️</span> Configurações
          </button>
          <button onClick={logout} className="w-full flex items-center gap-3 py-2 text-sm font-bold text-rose-300 mt-2">
             <span>🚪</span> Sair
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        <header className="bg-white dark:bg-slate-900 h-20 border-b flex items-center justify-between px-8 shrink-0 z-40 transition-colors">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-2xl">☰</button>
            <h2 className="font-black text-xl tracking-tight uppercase text-indigo-600">EduSmart Pro</h2>
          </div>
          <div className="flex items-center gap-4">
            <img src={user?.avatar} className="w-10 h-10 rounded-full border-2 border-indigo-100" alt="" />
            <div className="hidden sm:block text-right">
              <p className="text-xs font-black">{user?.name}</p>
              <p className="text-[9px] uppercase font-bold text-slate-400">{activeRole}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
           {children}
        </main>

        {/* Settings Modal */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}></div>
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl p-8 rounded-[40px] shadow-2xl border animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8 sticky top-0 bg-inherit z-10 py-2 border-b">
                <h3 className="text-2xl font-black tracking-tight uppercase">Configurações do Sistema</h3>
                <button onClick={() => setIsSettingsOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full">✕</button>
              </div>

              <div className="space-y-10">
                {/* Dark Mode */}
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Modo de Visualização</p>
                  <button onClick={toggleTheme} className="flex items-center gap-4 px-6 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full font-black text-sm hover:scale-[1.01] transition-transform">
                    {theme === 'light' ? '🌙 Ativar Modo Escuro' : '☀️ Ativar Modo Claro'}
                  </button>
                </div>

                {/* Cores de Fundo */}
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Cor de Fundo (8 opções)</p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {bgColors.map(color => (
                      <button 
                        key={color.class} 
                        onClick={() => setBgColor(color.class)} 
                        title={color.name}
                        className={`w-full aspect-square rounded-xl border-2 transition-all hover:scale-105 ${bgColor === color.class ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-lg scale-110 z-10' : 'border-slate-200'} ${color.class}`}
                      ></button>
                    ))}
                  </div>
                </div>

                {/* Tamanhos de Fonte */}
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Tamanho da Letra</p>
                  <div className="flex flex-wrap gap-3">
                    {fontSizes.map(size => (
                      <button 
                        key={size.value} 
                        onClick={() => setFontSize(size.value)} 
                        className={`flex-1 min-w-[100px] py-3 rounded-xl font-black text-xs border transition-all ${fontSize === size.value ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                      >
                        {size.label} ({size.value})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tipos de Fonte */}
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Tipografia (20 fontes premium)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {fontFamilies.map(font => (
                      <button 
                        key={font} 
                        onClick={() => setFontFamily(font)} 
                        className={`p-4 rounded-xl text-xs text-left border transition-all hover:border-indigo-300 ${fontFamily === font ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white border-slate-100 text-slate-600'}`}
                        style={{ fontFamily: font }}
                      >
                        <span className="block font-black text-[14px] mb-1">{font.split(',')[0]}</span>
                        <span className="opacity-70">O rápido raposo marrom pula sobre o cão preguiçoso.</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
