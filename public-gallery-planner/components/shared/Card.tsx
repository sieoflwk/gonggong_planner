import React, { type ReactNode } from 'react';

interface CardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ title, icon, children, className, action, style }) => {
  return (
    <section style={style} className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/60 dark:shadow-black/25 border border-slate-200/50 dark:border-slate-700/50 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-brand-primary-500 dark:text-brand-primary-400">
              {icon}
            </div>
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">{title}</h2>
          </div>
          <div>{action}</div>
        </div>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </section>
  );
};