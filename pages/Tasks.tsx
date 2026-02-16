
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Task } from '../types';

const Tasks: React.FC = () => {
  const { t, tasks, addTask, deleteTask, toggleTask } = useAppContext();
  const [newTitle, setNewTitle] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTitle,
      deadline: newDeadline || new Date().toISOString().split('T')[0],
      completed: false,
      priority: 'medium'
    };
    addTask(task);
    setNewTitle('');
    setNewDeadline('');
  };

  const getDeadlineStatus = (deadlineStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineStr);
    deadline.setHours(0, 0, 0, 0);
    
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: t.overdue, color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20', icon: '⚠️' };
    if (diffDays === 0) return { label: t.today, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20', icon: '📍' };
    if (diffDays === 1) return { label: t.tomorrow, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20', icon: '🕒' };
    if (diffDays <= 3) return { label: `${diffDays} ${t.daysLeft}`, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/10', icon: '📅' };
    return { label: new Date(deadlineStr).toLocaleDateString(), color: 'text-slate-500 bg-slate-50 dark:bg-slate-800/50', icon: '📅' };
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [tasks]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.tasks}</h1>
          <p className="text-slate-500 dark:text-slate-400">Gerencie seus prazos e entregas acadêmicas.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-medium shadow-sm">
          {tasks.filter(t => !t.completed).length} Pendentes
        </div>
      </div>
      
      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Descrição</label>
          <input 
            type="text" 
            placeholder="Ex: Estudar para a prova de biologia..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1 md:w-48">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Prazo Final</label>
          <input 
            type="date" 
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100 transition-all"
          />
        </div>
        <div className="flex flex-col justify-end">
          <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95 h-[52px]">
            {t.addTask}
          </button>
        </div>
      </form>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="text-4xl mb-4 opacity-50">✨</div>
            <p className="text-slate-400 font-medium">Nenhuma tarefa encontrada. Aproveite seu tempo livre!</p>
          </div>
        ) : (
          sortedTasks.map((task) => {
            const status = getDeadlineStatus(task.deadline);
            return (
              <div 
                key={task.id} 
                className={`group flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md ${task.completed ? 'opacity-60 bg-slate-50/50 grayscale-[0.5]' : ''}`}
              >
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'}`}
                  >
                    {task.completed && <span className="text-sm font-bold">✓</span>}
                  </button>
                  <div className="min-w-0">
                    <h3 className={`font-bold text-slate-800 dark:text-slate-100 truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${status.color}`}>
                        {status.icon} {status.label}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => deleteTask(task.id)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors">
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Tasks;
