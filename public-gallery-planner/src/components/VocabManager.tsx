
import React, { useState } from 'react';
import { type CustomWord } from '../types';
import { Card } from './shared/Card';
import { PlusIcon, TrashIcon, LanguageIcon } from './shared/icons';

interface VocabManagerProps {
    customWords: CustomWord[];
    setCustomWords: React.Dispatch<React.SetStateAction<CustomWord[]>>;
    showToast: (message: string, type?: 'success' | 'error') => void;
    showModal: (title: string, content: string, onConfirm: () => void) => void;
}

export const VocabManager: React.FC<VocabManagerProps> = ({ customWords, setCustomWords, showToast, showModal }) => {
    const [eng, setEng] = useState('');
    const [kor, setKor] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleAddWord = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEng = eng.trim();
        const trimmedKor = kor.trim();
        if (!trimmedEng || !trimmedKor) return;

        const newWord: CustomWord = {
            id: Date.now().toString(),
            eng: trimmedEng,
            kor: trimmedKor,
        };
        setCustomWords(prev => [newWord, ...prev]);
        setEng('');
        setKor('');
        showToast('단어가 추가되었습니다.', 'success');
    };

    const handleDeleteWord = (id: string) => {
        showModal('단어 삭제', '이 단어를 삭제하시겠습니까?', () => {
            setDeletingId(id);
            setTimeout(() => {
                setCustomWords(prev => prev.filter(w => w.id !== id));
                showToast('단어가 삭제되었습니다.', 'success');
                setDeletingId(null);
            }, 300);
        });
    };

    return (
        <Card title="나만의 단어장" icon={<LanguageIcon className="w-6 h-6" />} className="animate-card-pop-in" style={{ animationDelay: '200ms', opacity: 0 }}>
            <form onSubmit={handleAddWord} className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:items-center">
                <input
                    type="text"
                    value={eng}
                    onChange={(e) => setEng(e.target.value)}
                    placeholder="English"
                    className="w-full bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition"
                />
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={kor}
                        onChange={(e) => setKor(e.target.value)}
                        placeholder="한글 뜻"
                        className="flex-grow w-full bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition"
                    />
                    <button type="submit" className="flex-shrink-0 bg-brand-primary-500 text-white font-bold p-2.5 rounded-lg hover:bg-brand-primary-600 transition-colors disabled:opacity-50" disabled={!eng.trim() || !kor.trim()}>
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
            </form>
            <ul className="space-y-2 max-h-80 overflow-y-auto pr-2">
                 {customWords.length > 0 ? (
                    customWords.map((word, index) => {
                        const isDeleting = deletingId === word.id;
                        return (
                            <li 
                                key={word.id} 
                                className={`flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg group transition-all duration-300 ${isDeleting ? 'animate-list-item-exit overflow-hidden' : 'animate-slide-up-fade'}`}
                                style={isDeleting ? {} : { animationDelay: `${index * 50}ms`, opacity: 0 }}
                            >
                                <div className="flex-grow">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{word.eng}</span>
                                    <span className="text-slate-500 dark:text-slate-400"> : {word.kor}</span>
                                </div>
                                <button onClick={() => handleDeleteWord(word.id)} className="p-1.5 text-slate-500 hover:text-red-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-opacity opacity-0 group-hover:opacity-100">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </li>
                        );
                    })
                ) : (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-4">등록된 단어가 없습니다.</p>
                )}
            </ul>
        </Card>
    );
};
