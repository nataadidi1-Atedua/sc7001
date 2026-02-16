
import { Subject, Event, UserRole, User } from './types';

export const MOCK_USER: User = {
  id: '1',
  name: 'Gabriel Silva',
  email: 'gabriel.silva@escola.edu',
  role: UserRole.STUDENT,
  avatar: 'https://picsum.photos/seed/student/200'
};

export const MOCK_SUBJECTS: Subject[] = [
  { id: '1', name: 'Matemática', teacher: 'Prof. Ricardo', grade: 8.5, attendance: 95, color: '#3b82f6' },
  { id: '2', name: 'Português', teacher: 'Profa. Helena', grade: 9.0, attendance: 100, color: '#ec4899' },
  { id: '3', name: 'História', teacher: 'Prof. Cláudio', grade: 7.8, attendance: 88, color: '#f59e0b' },
  { id: '4', name: 'Física', teacher: 'Profa. Marina', grade: 6.5, attendance: 92, color: '#8b5cf6' },
  { id: '5', name: 'Biologia', teacher: 'Prof. André', grade: 8.2, attendance: 90, color: '#10b981' },
];

export const MOCK_EVENTS: Event[] = [
  { id: '1', title: 'Prova de Cálculo', date: '2024-05-20', type: 'EXAM' },
  { id: '2', title: 'Entrega: Redação', date: '2024-05-22', type: 'ASSIGNMENT' },
  { id: '3', title: 'Feriado Municipal', date: '2024-05-30', type: 'HOLIDAY' },
];
