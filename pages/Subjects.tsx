
import React from 'react';
import { MOCK_SUBJECTS } from '../constants';
import { useAppContext } from '../context/AppContext';

const Subjects: React.FC = () => {
  const { t } = useAppContext();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.subjects}</h1>
        <div className="flex gap-2">
          <button className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
            🔍
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            {t.newRequest}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SUBJECTS.map((subject) => (
          <div key={subject.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: subject.color }}></div>
            <div className="flex justify-between items-start mb-4 pl-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{subject.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{subject.teacher}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full text-sm font-bold border border-slate-100 dark:border-slate-700 dark:text-slate-200">
                {subject.grade.toFixed(1)}
              </div>
            </div>
            
            <div className="space-y-3 pl-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">{t.attendance}</span>
                <span className="font-medium dark:text-slate-200">{subject.attendance}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full rounded-full" 
                  style={{ width: `${subject.attendance}%`, backgroundColor: subject.color }}
                ></div>
              </div>
            </div>

            <div className="mt-6 flex gap-2 pl-2">
              <button className="flex-1 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">NOTAS</button>
              <button className="flex-1 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">MATERIAL</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
