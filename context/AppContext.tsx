
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Theme, Task, User, UserRole, ApprovalRequest, SystemNotification } from '../types';
import { translations } from '../translations';

interface AppContextType {
  theme: Theme;
  language: Language;
  t: any;
  user: User | null;
  activeRole: UserRole | null;
  setActiveRole: (role: UserRole) => void;
  tasks: Task[];
  employees: User[];
  approvals: ApprovalRequest[];
  notifications: SystemNotification[];
  fontSize: string;
  fontFamily: string;
  bgColor: string;
  setTheme: (t: Theme) => void;
  setLanguage: (l: Language) => void;
  toggleTheme: () => void;
  login: (password: string) => boolean;
  logout: () => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  createApprovalRequest: (req: Omit<ApprovalRequest, 'id' | 'status' | 'timestamp'>) => void;
  handleApproval: (id: string, action: 'APPROVED' | 'CANCELLED') => void;
  addNotification: (from: string, message: string) => void;
  updateUser: (userId: string, data: Partial<User>) => void;
  setFontSize: (size: string) => void;
  setFontFamily: (family: string) => void;
  setBgColor: (color: string) => void;
}

const MOCK_EMPLOYEES: User[] = [
  { id: '100', name: 'Gestor Master', email: 'gestor@edu.com', role: UserRole.ADMIN, avatar: 'https://i.pravatar.cc/150?u=100', password: 'admin' },
  { id: '101', name: 'Dr. Roberto', email: 'diretor@edu.com', role: UserRole.DIRECTOR_ESCOLAR, avatar: 'https://i.pravatar.cc/150?u=101', password: 'diretor' },
  { id: '102', name: 'Dra. Elena', email: 'pedagogico@edu.com', role: UserRole.DIRECTOR_PEDAGOGICO, avatar: 'https://i.pravatar.cc/150?u=102', password: 'pedag' },
  { id: '103', name: 'Secretário João', email: 'secretaria@edu.com', role: UserRole.SECRETARIA, avatar: 'https://i.pravatar.cc/150?u=103', password: 'sec' },
  { id: '104', name: 'Financeiro Silva', email: 'financa@edu.com', role: UserRole.FINANCA, avatar: 'https://i.pravatar.cc/150?u=104', password: 'fin' },
  { id: '105', name: 'RH Maria', email: 'rh@edu.com', role: UserRole.RH, avatar: 'https://i.pravatar.cc/150?u=105', password: 'rh' },
  { id: '106', name: 'Prof. Gabriel', email: 'gabriel@edu.com', role: UserRole.TEACHER, avatar: 'https://i.pravatar.cc/150?u=106', password: 'prof' },
  { id: '107', name: 'Vigilante Santos', email: 'vigilante@edu.com', role: UserRole.VIGILANTE, avatar: 'https://i.pravatar.cc/150?u=107', password: 'vig' },
  { id: '108', name: 'Coordenadora Ana', email: 'coord@edu.com', role: UserRole.COORDENADOR, avatar: 'https://i.pravatar.cc/150?u=108', password: 'coord' },
  { id: '109', name: 'Aluno Felipe', email: 'felipe@edu.com', role: UserRole.STUDENT, avatar: 'https://i.pravatar.cc/150?u=109', password: 'aluno' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('language') as Language) || 'pt');
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [tasks, setTasks] = useState<Task[]>(() => JSON.parse(localStorage.getItem('tasks') || '[]'));
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([
    {
      id: 'mock-1',
      requesterName: 'Dra. Elena',
      requesterRole: UserRole.DIRECTOR_PEDAGOGICO,
      targetEmployee: 'Prof. Carlos Mendes',
      area: 'Matemática / Ensino Médio',
      reason: 'Revisão de carga horária para projeto de reforço escolar no contraturno.',
      status: 'PENDING',
      timestamp: new Date()
    }
  ]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [employees, setEmployees] = useState<User[]>(MOCK_EMPLOYEES);
  
  const [fontSize, setFontSizeState] = useState(() => localStorage.getItem('fontSize') || '16px');
  const [fontFamily, setFontFamilyState] = useState(() => localStorage.getItem('fontFamily') || 'Inter, sans-serif');
  const [bgColor, setBgColorState] = useState(() => localStorage.getItem('bgColor') || 'bg-slate-50');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  useEffect(() => { localStorage.setItem('language', language); }, [language]);
  useEffect(() => { localStorage.setItem('fontSize', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('fontFamily', fontFamily); }, [fontFamily]);
  useEffect(() => { localStorage.setItem('bgColor', bgColor); }, [bgColor]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const login = (password: string): boolean => {
    const found = employees.find(e => e.password === password);
    if (found) {
      setUser(found);
      setActiveRole(found.role);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setActiveRole(null);
  };

  const createApprovalRequest = (req: Omit<ApprovalRequest, 'id' | 'status' | 'timestamp'>) => {
    const newReq: ApprovalRequest = {
      ...req,
      id: Math.random().toString(36).substr(2, 9),
      status: 'PENDING',
      timestamp: new Date()
    };
    setApprovals(prev => [newReq, ...prev]);
  };

  const handleApproval = (id: string, action: 'APPROVED' | 'CANCELLED') => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: action } : a));
  };

  const addNotification = (from: string, message: string) => {
    const newNotif: SystemNotification = {
      id: Math.random().toString(36).substr(2, 9),
      from,
      message,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateUser = (userId: string, data: Partial<User>) => {
    setEmployees(prev => prev.map(e => e.id === userId ? { ...e, ...data } : e));
    if (user?.id === userId) setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const addTask = (task: Task) => setTasks(prev => [...prev, task]);
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));
  const toggleTask = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const t = translations[language] || translations['en'];

  return (
    <AppContext.Provider value={{ 
      theme, language, t, user, activeRole, setActiveRole, tasks, fontSize, fontFamily, bgColor, employees, approvals, notifications,
      setTheme, setLanguage, toggleTheme, login, logout, 
      addTask, deleteTask, toggleTask, createApprovalRequest, handleApproval, addNotification, updateUser,
      setFontSize: setFontSizeState, setFontFamily: setFontFamilyState, setBgColor: setBgColorState
    }}>
      <div style={{ fontSize, fontFamily }} className={`min-h-screen ${bgColor} dark:bg-slate-950 transition-all duration-300`}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
