
import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import AITutor from './pages/AITutor';
import Tasks from './pages/Tasks';
import Auth from './pages/Auth';
import Management from './pages/Management';
import { AppProvider, useAppContext } from './context/AppContext';

const AppContent: React.FC = () => {
  const { user } = useAppContext();

  if (!user) {
    return <Auth />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/materias" element={<Subjects />} />
          <Route path="/agenda" element={<div className="p-12 text-center text-slate-400 dark:text-slate-500 font-medium">📅 Calendário em desenvolvimento...</div>} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/ai-tutor" element={<AITutor />} />
          <Route path="/gestao" element={<Management />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
