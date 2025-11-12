
import React from 'react';
import { Card } from './shared/Card';
import { CalendarDaysIcon } from './shared/icons';

interface DDayCounterProps {
    examDate1: string | null;
    setExamDate1: (date: string | null) => void;
    examDate2: string | null;
    setExamDate2: (date: string | null) => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const DDayItem: React.FC<{
    label: string,
    date: string | null,
    setDate: (date: string | null) => void,
    showToast: (message: string, type?: 'success' | 'error') => void;
}> = ({ label, date, setDate, showToast }) => {

    const calculateDDay = () => {
        if (!date) return { text: "D-?", days: null };
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const examDay = new Date(date);
        examDay.setHours(0,0,0,0);
        
        const diffTime = examDay.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) return { text: `D-${diffDays}`, days: diffDays };
        if (diffDays === 0) return { text: 'D-DAY', days: 0 };
        return { text: `D+${Math.abs(diffDays)}`, days: diffDays };
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = e.target.value;
      if (newDate) {
        setDate(newDate);
        showToast(`${label} D-Day가 설정되었습니다.`, 'success');
      }
    }

    const { text: dDayText, days } = calculateDDay();
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    // Progress within a 100-day window
    const progress = days !== null && days >= 0 ? Math.max(0, 1 - (days / 100)) : 0;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div className="flex flex-col items-center">
             <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">{label}</h3>
             <div className="relative w-36 h-36">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                        className="text-slate-200 dark:text-slate-700"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50"
                        cy="50"
                    />
                    {/* Progress circle */}
                    <circle
                        className="text-brand-primary-500 dark:text-brand-primary-400"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50"
                        cy="50"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset,
                            transform: 'rotate(-90deg)',
                            transformOrigin: '50% 50%',
                            transition: 'stroke-dashoffset 0.5s ease-out'
                        }}
                    />
                    <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-2xl font-extrabold fill-current text-brand-primary-600 dark:text-brand-primary-300">
                        {dDayText}
                    </text>
                </svg>
             </div>
            <input 
                type="date"
                value={date || ''}
                onChange={handleDateChange}
                className="mt-4 w-full bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-lg px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition"
            />
        </div>
    );
};

export const DDayCounter: React.FC<DDayCounterProps> = (props) => {
    return (
        <Card title="D-DAY" icon={<CalendarDaysIcon className="w-6 h-6" />} className="animate-card-pop-in" style={{ animationDelay: '150ms', opacity: 0 }}>
            <div className="flex justify-around items-center">
                <DDayItem label="국가직" date={props.examDate1} setDate={props.setExamDate1} showToast={props.showToast} />
                <DDayItem label="지방직" date={props.examDate2} setDate={props.setExamDate2} showToast={props.showToast} />
            </div>
        </Card>
    );
};
