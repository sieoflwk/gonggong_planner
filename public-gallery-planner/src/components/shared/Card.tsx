import React, { type ReactNode } from 'react';

export const EmptyState: React.FC<{ icon: ReactNode; title: string; description: string; }> = ({ icon, title, description }) => {
    return (
        <div className="text-center p-8 rounded-lg bg-slate-50 dark:bg-slate-800/20 h-full flex flex-col justify-center items-center animate-fade-in">
            <div className="w-16 h-16 flex items-center justify-center bg-slate-200 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        </div>
    );
};

interface CardProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ title, icon, children, className, action, style }) => {
  const hasHeader = title || icon || action;

  return (
    <section style={style} className={`bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-200/60 dark:shadow-black/25 border border-slate-200/50 dark:border-slate-800 ${className}`}>
      <div className="p-6">
        {hasHeader && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {icon && <div className="text-brand-primary-500 dark:text-brand-primary-400">{icon}</div>}
              {title && <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">{title}</h2>}
            </div>
            {action && <div>{action}</div>}
          </div>
        )}
        <div className={hasHeader ? "space-y-4" : ""}>
          {children}
        </div>
      </div>
    </section>
  );
};
