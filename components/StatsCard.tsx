
import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, trend, trendColor }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-start justify-between transition-colors">
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</h3>
        {trend && (
          <p className={`text-xs mt-2 font-semibold ${trendColor || 'text-emerald-500'}`}>
            {trend}
          </p>
        )}
      </div>
      <div className="bg-indigo-50 dark:bg-indigo-900/40 p-3 rounded-xl text-2xl">
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;
