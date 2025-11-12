
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
    AcademicCapIcon, 
    BookOpenIcon, 
    CalendarDaysIcon, 
    ChartBarIcon,
    CheckCircleIcon, 
    CogIcon, 
    DocumentTextIcon, 
    LanguageIcon, 
    SunIcon,
    XMarkIcon 
} from './shared/icons';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const features = [
    {
        icon: <BookOpenIcon className="w-8 h-8 text-brand-primary-500" />,
        title: "과목 관리",
        description: "학습 과목을 추가, 수정, 삭제하고 '회독' 횟수를 +1/-1 버튼으로 추적하여 학습 진행 상황을 관리하세요.",
    },
    {
        icon: <CheckCircleIcon className="w-8 h-8 text-green-500" />,
        title: "오늘의 할 일",
        description: "매일의 학습 목표나 할 일을 목록으로 만들어 체계적으로 관리하고, 완료 시 체크하여 진행 상황을 파악할 수 있습니다.",
    },
    {
        icon: <LanguageIcon className="w-8 h-8 text-sky-500" />,
        title: "나만의 단어장",
        description: "학습 중 모르는 단어를 영어와 한글 뜻으로 나누어 저장하고 관리하는 개인 맞춤형 단어장입니다.",
    },
    {
        icon: <DocumentTextIcon className="w-8 h-8 text-amber-500" />,
        title: "오답노트",
        description: "틀린 문제를 과목별로 정리하고, 관련 사진을 첨부하여 복습 효율을 높일 수 있습니다. 검색 기능으로 쉽게 찾아보세요.",
    },
    {
        icon: <CalendarDaysIcon className="w-8 h-8 text-red-500" />,
        title: "D-DAY 카운터",
        description: "국가직, 지방직 등 주요 시험 날짜를 설정하여 남은 기간을 시각적으로 확인하고 학습 동기를 부여받으세요.",
    },
    {
        icon: <ChartBarIcon className="w-8 h-8 text-cyan-500" />,
        title: "학습 통계",
        description: "헤더의 차트 아이콘으로 통계 페이지로 이동하여, 회독 수, 할 일 달성률, 오답노트 분포 등 학습 현황을 그래프로 한눈에 분석할 수 있습니다.",
    },
    {
        icon: <AcademicCapIcon className="w-8 h-8 text-indigo-500" />,
        title: "오늘의 영어단어",
        description: "엄선된 빈출 단어가 매번 랜덤으로 제시됩니다. 카드를 클릭하면 뜻이 나타나는 3D 플립 효과로 재미있게 학습하세요.",
    },
    {
        icon: <CogIcon className="w-8 h-8 text-slate-500" />,
        title: "설정 (데이터 관리)",
        description: "학습 데이터를 JSON 파일로 '백업'하거나, 백업된 파일을 '복구'할 수 있습니다. '모든 데이터 삭제'로 초기화도 가능합니다.",
    },
    {
        icon: <SunIcon className="w-8 h-8 text-yellow-500" />,
        title: "다크 모드 & UI",
        description: "우측 상단 토글 버튼으로 라이트/다크 모드를 전환할 수 있습니다. 모든 요소에는 부드러운 애니메이션이 적용되어 있습니다.",
    },
];

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl m-4 transform transition-transform duration-300 animate-card-pop-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">플래너 사용 가이드</h2>
                    <button 
                        onClick={onClose} 
                        className="p-1.5 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        aria-label="닫기"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map(feature => (
                            <div key={feature.title} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <div className="flex-shrink-0">{feature.icon}</div>
                                <div>
                                    <h3 className="font-bold text-slate-700 dark:text-slate-200">{feature.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById('portal')!
    );
};
