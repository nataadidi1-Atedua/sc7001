
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN', // Administrador Gestor
  DIRECTOR_ESCOLAR = 'DIRECTOR_ESCOLAR',
  DIRECTOR_PEDAGOGICO = 'DIRECTOR_PEDAGOGICO',
  SECRETARIA = 'SECRETARIA',
  FINANCA = 'FINANCA',
  RH = 'RH',
  COORDENADOR = 'COORDENADOR',
  VIGILANTE = 'VIGILANTE'
}

export type Language = 'pt' | 'en' | 'es' | 'fr' | 'zh' | 'ja' | 'it';
export type Theme = 'light' | 'dark';

export interface ApprovalRequest {
  id: string;
  requesterName: string;
  requesterRole: UserRole;
  targetEmployee: string; // Nome do funcionário a ser alterado
  area: string; // Área/Setor do funcionário
  reason: string; // Motivo da alteração
  status: 'PENDING' | 'APPROVED' | 'CANCELLED';
  timestamp: Date;
  attachmentUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  password?: string;
}

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  grade: number;
  attendance: number;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  deadline: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Event {
  id: string;
  title: string;
  date: string;
  type: 'EXAM' | 'ASSIGNMENT' | 'HOLIDAY';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface SystemNotification {
  id: string;
  message: string;
  from: string;
  timestamp: Date;
  read: boolean;
}
