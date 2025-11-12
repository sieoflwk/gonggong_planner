import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from './shared/Card';
import { CogIcon, PlayIcon, PauseIcon, ArrowPathIcon } from './shared/icons';

const WORK_MINS = 25;
const SHORT_BREAK_MINS = 5;
const LONG_BREAK_MINS = 15;

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export const PomodoroTimer: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
    const [mode, setMode] = useState<TimerMode>('work');
    const [isActive, setIsActive] = useState(false);
    
    const initialTime = useMemo(() => {
        switch (mode) {
            case 'work': return WORK_MINS * 60;
            case 'shortBreak': return SHORT_BREAK_MINS * 60;
            case 'longBreak': return LONG_BREAK_MINS * 60;
            default: return WORK_MINS * 60;
        }
    }, [mode]);
    
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        setTimeLeft(initialTime);
        setIsActive(false);
    }, [mode, initialTime]);
    
    useEffect(() => {
        // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            setIsActive(false);
            // Here you could add a notification sound
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft]);
    
    const toggleTimer = () => setIsActive(!isActive);
    
    const resetTimer = useCallback(() => {
        setIsActive(false);
        setTimeLeft(initialTime);
    }, [initialTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const progress = (timeLeft / initialTime);
    const strokeDashoffset = circumference * (1 - progress);

    const modeButtons: { mode: TimerMode; label: string }[] = [
        { mode: 'work', label: '업무' },
        { mode: 'shortBreak', label: '짧은 휴식' },
        { mode: 'longBreak', label: '긴 휴식' }
    ];

    return (
        <Card title="뽀모도로 타이머" icon={<CogIcon className="w-6 h-6" />} className="animate-card-pop-in" style={style}>
            <div className="flex justify-center gap-2 mb-4">
                {modeButtons.map(({ mode: btnMode, label }) => (
                    <button 
                        key={btnMode}
                        onClick={() => setMode(btnMode)}
                        className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${mode === btnMode ? 'bg-brand-primary-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <div className="relative w-40 h-40 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-slate-200 dark:text-slate-700" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="50" cy="50" />
                    <circle
                        className="text-brand-primary-500 dark:text-brand-primary-400"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50"
                        cy="50"
                        style={{ strokeDasharray: circumference, strokeDashoffset, transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.3s' }}
                    />
                    <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-3xl font-bold fill-current text-slate-700 dark:text-slate-200">
                        {formatTime(timeLeft)}
                    </text>
                </svg>
            </div>
             <div className="flex justify-center items-center gap-4 mt-4">
                <button onClick={resetTimer} className="p-3 text-slate-500 hover:text-brand-primary-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Reset Timer">
                    <ArrowPathIcon className="w-6 h-6" />
                </button>
                <button onClick={toggleTimer} className="w-16 h-16 bg-brand-primary-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-brand-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500" aria-label={isActive ? 'Pause Timer' : 'Start Timer'}>
                    {isActive ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
                </button>
                <div className="w-12 h-12"></div>
            </div>
        </Card>
    );
};