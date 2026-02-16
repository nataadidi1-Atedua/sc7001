
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import StatsCard from '../components/StatsCard';
import { MOCK_SUBJECTS, MOCK_EVENTS } from '../constants';
import { useAppContext } from '../context/AppContext';

const Dashboard: React.FC = () => {
  const { t, theme } = useAppContext();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.hello}, Gabriel! 👋</h1>
          <p className="text-slate-500 dark:text-slate-400">{t.summary}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-sm font-medium dark:text-slate-300">2º Semestre 2024</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label={t.overallGrade} value="8.2" icon="🏆" trend="+0.5 pts" />
        <StatsCard label={t.attendance} value="93%" icon="🙋‍♂️" trend="Good" />
        <StatsCard label={t.activities} value="12/15" icon="📝" trend="3 pendentes" trendColor="text-amber-500" />
        <StatsCard label={t.ranking} value="4º" icon="⭐" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-slate-100">{t.performance}</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_SUBJECTS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#f1f5f9'} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b' }} 
                />
                <YAxis 
                  domain={[0, 10]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b' }} 
                />
                <Tooltip 
                  cursor={{fill: theme === 'dark' ? '#1e293b' : '#f8fafc'}}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    color: theme === 'dark' ? '#f1f5f9' : '#1e293b'
                  }}
                />
                <Bar dataKey="grade" radius={[6, 6, 0, 0]} barSize={40}>
                  {MOCK_SUBJECTS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-slate-100">{t.upcomingEvents}</h3>
          <div className="space-y-4">
            {MOCK_EVENTS.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-hover hover:border-indigo-200">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0
                  ${event.type === 'EXAM' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30' : event.type === 'ASSIGNMENT' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'}
                `}>
                  {event.type === 'EXAM' ? '📖' : event.type === 'ASSIGNMENT' ? '✍️' : '🎈'}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{event.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors">
            {t.agenda}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
