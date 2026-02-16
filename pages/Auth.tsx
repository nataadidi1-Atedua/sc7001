
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Auth: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login, t } = useAppContext();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const rolePasswords = [
    { label: 'Gestor', pass: 'admin' },
    { label: 'Dir. Escolar', pass: 'diretor' },
    { label: 'Dir. Pedagógico', pass: 'pedag' },
    { label: 'Secretaria', pass: 'sec' },
    { label: 'Finança', pass: 'fin' },
    { label: 'RH', pass: 'rh' },
    { label: 'Aluno', pass: 'aluno' },
    { label: 'Coord.', pass: 'coord' },
    { label: 'Professor', pass: 'prof' },
    { label: 'Vigilante', pass: 'vig' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 font-['Inter']">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-2xl shadow-indigo-100 dark:shadow-none border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl shadow-indigo-200 rotate-3">
            <span className="text-4xl">🎓</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Portal EduSmart</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Digite a senha da sua área para entrar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[2px] ml-1">Senha da Área</label>
            <div className={`relative group transition-all duration-300 ${error ? 'animate-shake' : ''}`}>
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-slate-50 dark:bg-slate-800 border-2 ${error ? 'border-rose-300 ring-rose-100' : 'border-slate-50 dark:border-slate-800 focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50'} rounded-[24px] pl-14 pr-6 py-5 text-slate-800 dark:text-slate-100 outline-none transition-all placeholder:text-slate-300 font-bold`}
              />
            </div>
            {error && <p className="text-[10px] text-rose-500 font-bold ml-1 text-center">Senha incorreta para acesso restrito</p>}
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[24px] shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-3 transition-all active:scale-95 group"
          >
            {t.login}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
            </svg>
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-50 dark:border-slate-800">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-6">Ambientes Disponíveis</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {rolePasswords.map(rp => (
              <button 
                key={rp.pass}
                onClick={() => setPassword(rp.pass)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all text-center truncate"
              >
                {rp.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default Auth;
