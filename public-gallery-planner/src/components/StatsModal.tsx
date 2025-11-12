import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { type Subject, type Todo, type Note, type CustomWord } from '../types';
import { 
    XMarkIcon,
    BookOpenIcon,
    DocumentTextIcon,
    LanguageIcon
} from './shared/icons';

interface StatsModalProps {
    isOpen: boolean;
    onClose: () => void;
    subjects: Subject[];
    todos: Todo[];
    notes: Note[];
    customWords: CustomWord[];
}

const CircularProgress: React.FC<{ percentage: number }> = ({ percentage }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                    className="text-slate-200 dark:text-slate-700"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className="text-brand-primary-500"
                    strokeWidth="10"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                        transition: 'stroke-dashoffset 1s ease-out'
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-slate-700 dark:text-slate-100">{`${Math.round(percentage)}%`}</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">오늘의 달성률</span>
            </div>
        </div>
    );
};

const StatItem: React.FC<{ icon: React.ReactNode; value: number; label: string }> = ({ icon, value, label }) => (
    <div className="text-center">
        <div className="mx-auto w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-700/60 rounded-full mb-2 text-brand-primary-500 dark:text-brand-primary-400">
            {icon}
        </div>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
);


export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, subjects, todos, notes, customWords }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const stats = useMemo(() => {
        const totalCount = subjects.reduce((sum, s) => sum + s.count, 0);
        const completedTodos = todos.filter(t => t.completed).length;
        const totalTodos = todos.length;
        const todoPercentage = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;
        return {
            totalCount,
            todoPercentage,
            totalNotes: notes.length,
            totalCustomWords: customWords.length
        };
    }, [subjects, todos, notes, customWords]);

    const [animatedStats, setAnimatedStats] = useState({
        totalCount: 0,
        todoPercentage: 0,
        totalNotes: 0,
        totalCustomWords: 0,
    });

    useEffect(() => {
        if (!isOpen) return;

        const animationDuration = 1000;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / animationDuration, 1);

            setAnimatedStats({
                totalCount: Math.floor(progress * stats.totalCount),
                todoPercentage: progress * stats.todoPercentage,
                totalNotes: Math.floor(progress * stats.totalNotes),
                totalCustomWords: Math.floor(progress * stats.totalCustomWords),
            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        const animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isOpen, stats]);


    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg m-4 transform transition-transform duration-300 animate-card-pop-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">학습 현황 대시보드</h2>
                    <button 
                        onClick={onClose} 
                        className="p-1.5 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        aria-label="닫기"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 md:p-8 flex flex-col items-center gap-8">
                    <CircularProgress percentage={animatedStats.todoPercentage} />
                    <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                         <StatItem 
                            icon={<BookOpenIcon className="w-6 h-6" />}
                            value={animatedStats.totalCount}
                            label="총 회독 수"
                        />
                         <StatItem 
                            icon={<DocumentTextIcon className="w-6 h-6" />}
                            value={animatedStats.totalNotes}
                            label="오답노트"
                        />
                         <StatItem 
                            icon={<LanguageIcon className="w-6 h-6" />}
                            value={animatedStats.totalCustomWords}
                            label="저장 단어"
                        />
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById('portal')!
    );
};
