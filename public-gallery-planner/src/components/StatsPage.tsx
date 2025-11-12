
import React from 'react';
import { type Subject, type Todo, type Note } from '../types';
import { Card } from './shared/Card';
import { BookOpenIcon, CheckCircleIcon, DocumentTextIcon } from './shared/icons';

interface StatsPageProps {
    subjects: Subject[];
    todos: Todo[];
    notes: Note[];
}

const barColors = [
    '#38bdf8', '#34d399', '#facc15', '#f472b6', 
    '#818cf8', '#2dd4bf', '#fbbf24', '#ec4899'
];

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; }> = ({ label, value, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg shadow-slate-200/60 dark:shadow-black/25 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-brand-primary-100 dark:bg-brand-primary-900/50 text-brand-primary-500 dark:text-brand-primary-400">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
    </div>
);

const DoughnutChart: React.FC<{ data: { label: string; value: number; color: string }[], title: string }> = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{title}</p>
                <div className="h-48 flex items-center justify-center">
                    <p className="text-slate-500 dark:text-slate-400">데이터가 없습니다.</p>
                </div>
            </div>
        );
    }

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    let accumulatedAngle = -90;

    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">{title}</p>
            <div className="relative">
                <svg width="200" height="200" viewBox="0 0 100 100">
                    {data.map((item, index) => {
                        const percentage = item.value / total;
                        const strokeDasharray = `${percentage * circumference} ${circumference}`;
                        const rotation = accumulatedAngle;
                        accumulatedAngle += percentage * 360;

                        return (
                            <circle
                                key={index}
                                r={radius}
                                cx="50"
                                cy="50"
                                fill="transparent"
                                stroke={item.color}
                                strokeWidth="15"
                                strokeDasharray={strokeDasharray}
                                style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 50%' }}
                            />
                        );
                    })}
                </svg>
            </div>
             <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                {data.map(item => (
                    <div key={item.label} className="flex items-center text-sm">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                        <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const StatsPage: React.FC<StatsPageProps> = ({ subjects, todos, notes }) => {
    // Key Metrics
    const totalReviews = subjects.reduce((sum, s) => sum + s.count, 0);
    const completedTodos = todos.filter(t => t.completed).length;
    const totalTodos = todos.length;
    const todoCompletionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
    const totalNotes = notes.length;

    // Data for charts
    const reviewData = subjects
        .filter(s => s.count > 0)
        .map((subject, index) => ({
            label: subject.name,
            value: subject.count,
            color: barColors[index % barColors.length],
        }));

    const todoData = [
        { label: '완료', value: completedTodos, color: '#34d399' },
        { label: '미완료', value: totalTodos - completedTodos, color: '#f87171' },
    ];
    
    const notesBySubject = subjects.map(subject => ({
        name: subject.name,
        count: notes.filter(note => note.subjectId === subject.id).length,
    }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count);

    const maxNoteCount = notesBySubject.length > 0 ? Math.max(...notesBySubject.map(s => s.count)) : 0;


    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="총 회독 수" value={totalReviews} icon={<BookOpenIcon className="w-6 h-6"/>} />
                <StatCard label="할 일 달성률" value={`${todoCompletionRate}%`} icon={<CheckCircleIcon className="w-6 h-6"/>} />
                <StatCard label="총 오답노트" value={totalNotes} icon={<DocumentTextIcon className="w-6 h-6"/>} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="" icon={<></>} className="min-h-[350px]">
                    <DoughnutChart data={reviewData} title="과목별 회독 수" />
                </Card>
                <Card title="" icon={<></>} className="min-h-[350px]">
                    <DoughnutChart data={todoData} title="오늘의 할 일 현황" />
                </Card>
            </div>
            
             <Card title="과목별 오답노트 분포" icon={<DocumentTextIcon className="w-6 h-6" />}>
                {notesBySubject.length > 0 ? (
                    <div className="flex items-end gap-4 h-64 p-4 border-l border-b border-slate-200 dark:border-slate-700">
                        {notesBySubject.map((item, index) => {
                            const barHeight = maxNoteCount > 0 ? (item.count / maxNoteCount) * 100 : 0;
                            const color = barColors[index % barColors.length];
                            
                            return (
                                <div key={item.name} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="relative w-full h-full flex items-end">
                                        <div 
                                            className="w-full rounded-t-lg transition-all duration-700 ease-out hover:opacity-80"
                                            style={{ height: `${barHeight}%`, backgroundColor: color }}
                                        >
                                           <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">{item.count}</span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-center truncate w-full text-slate-600 dark:text-slate-400 font-medium">{item.name}</div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-4">오답노트를 작성하면 통계가 표시됩니다.</p>
                )}
            </Card>
        </div>
    );
};
