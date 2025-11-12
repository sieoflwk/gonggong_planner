import React from 'react';
import { type Theme } from '../types';
import { SunIcon, MoonIcon, QuestionMarkCircleIcon, ChartBarIcon } from './shared/icons';

interface HeaderProps {
    theme: Theme;
    onThemeToggle: () => void;
    onHelpClick: () => void;
    onStatsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle, onHelpClick, onStatsClick }) => {
    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/80 dark:bg-slate-900/80">
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary-500 to-sky-400 dark:from-brand-primary-400 dark:to-sky-300">
                        공공갤 플래너
                    </h1>

                    <div className="flex items-center gap-2">
                         <button
                            onClick={onStatsClick}
                            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                            aria-label="대시보드 보기"
                        >
                            <ChartBarIcon className="w-6 h-6" />
                        </button>
                        <button
                            onClick={onHelpClick}
                            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                            aria-label="도움말 보기"
                        >
                            <QuestionMarkCircleIcon className="w-6 h-6" />
                        </button>
                         <button 
                            onClick={onThemeToggle}
                            className="w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                            aria-label="Toggle theme"
                        >
                            <span className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'} flex items-center justify-center`}>
                                {theme === 'light' ? <SunIcon className="w-4 h-4 text-yellow-500" /> : <MoonIcon className="w-4 h-4 text-slate-400" />}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};