import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { type CustomWord, type VocabularyWord } from '../types';
import { Card } from './shared/Card';
import { LanguageIcon, RefreshIcon } from './shared/icons';

interface TodayWordProps {
    customWords: CustomWord[];
    builtInVocabulary: VocabularyWord[];
}

export const TodayWord: React.FC<TodayWordProps> = ({ customWords, builtInVocabulary }) => {

    const allWords = useMemo(() => {
        return [...builtInVocabulary, ...customWords];
    }, [customWords, builtInVocabulary]);

    const [todayWord, setTodayWord] = useState<VocabularyWord | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);

    const pickNewWord = useCallback(() => {
        if (allWords.length === 0) {
            setTodayWord(null);
            return;
        }
        const randomIndex = Math.floor(Math.random() * allWords.length);
        setTodayWord(allWords[randomIndex]);
        setIsFlipped(false);
    }, [allWords]);

    useEffect(() => {
        pickNewWord();
    }, [pickNewWord]);

    const handleCardClick = () => {
        if (todayWord) {
            setIsFlipped(!isFlipped);
        }
    };

    return (
        <Card 
            title="오늘의 영어단어" 
            icon={<LanguageIcon className="w-6 h-6" />}
            action={
                <button 
                    onClick={pickNewWord} 
                    className="p-1.5 text-slate-500 hover:text-brand-primary-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    aria-label="새 단어"
                >
                    <RefreshIcon className="w-5 h-5" />
                </button>
            }
            className="animate-card-pop-in" 
            style={{ animationDelay: '300ms', opacity: 0 }}
        >
            <div className="text-center p-2 perspective-1000">
                {todayWord ? (
                    <div 
                        className={`relative w-full h-24 transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                        onClick={handleCardClick}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
                        aria-live="polite"
                    >
                        {/* Front Side */}
                        <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-700/50 rounded-lg p-4">
                            <h3 className="text-3xl font-bold text-brand-primary-600 dark:text-brand-primary-400">{todayWord.eng}</h3>
                        </div>
                        {/* Back Side */}
                        <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center bg-brand-primary-100 dark:bg-slate-700 rounded-lg p-4">
                            <p className="text-2xl font-semibold text-brand-primary-800 dark:text-brand-primary-200">{todayWord.kor}</p>
                        </div>
                    </div>
                ) : (
                    <div className="h-24 flex items-center justify-center">
                        <p className="text-slate-500 dark:text-slate-400">나만의 단어장에 단어를 추가해주세요.</p>
                    </div>
                )}
            </div>
        </Card>
    );
};