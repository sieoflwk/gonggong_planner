import React, { useState } from 'react';
import { type Subject, type Note } from '../types';
import { Card, EmptyState } from './shared/Card';
import { EditIcon, TrashIcon, PlusIcon, BookOpenIcon } from './shared/icons';

interface SubjectManagerProps {
    subjects: Subject[];
    setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    showToast: (message: string, type?: 'success' | 'error') => void;
    showModal: (title: string, content: string, onConfirm: () => void) => void;
}

const SubjectItem: React.FC<{
    subject: Subject;
    onUpdate: (id: string, newName: string) => void;
    onDelete: (id: string) => void;
    onIncrement: (id: string) => void;
    onDecrement: (id: string) => void;
    index: number;
    deletingId: string | null;
}> = ({ subject, onUpdate, onDelete, onIncrement, onDecrement, index, deletingId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(subject.name);
    const isDeleting = deletingId === subject.id;

    const handleSave = () => {
        if (name.trim() && name.trim() !== subject.name) {
            onUpdate(subject.id, name.trim());
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') {
            setName(subject.name);
            setIsEditing(false);
        }
    };
    
    return (
        <li 
            className={`flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg transition-all duration-300 ${isDeleting ? 'animate-list-item-exit overflow-hidden' : 'animate-slide-up-fade'}`}
            style={isDeleting ? {} : { animationDelay: `${index * 50}ms`, opacity: 0 }}
        >
            {isEditing ? (
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="w-full bg-transparent p-1 border-b-2 border-brand-primary-500 focus:outline-none"
                />
            ) : (
                <div className="flex items-center gap-3 flex-grow min-w-0">
                    <span className="font-bold text-brand-primary-600 dark:text-brand-primary-400 truncate">{subject.name}</span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2.5 py-0.5 rounded-full">{subject.count}회독</span>
                </div>
            )}
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                 <button onClick={() => onDecrement(subject.id)} className="px-2 py-0.5 text-xs font-bold text-slate-600 bg-slate-200 rounded-md hover:bg-slate-300 dark:text-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors">-1</button>
                 <button onClick={() => onIncrement(subject.id)} className="px-2 py-0.5 text-xs font-bold text-white bg-green-500 rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-colors">+1</button>
                 <button onClick={() => setIsEditing(true)} className="p-1.5 text-slate-500 hover:text-brand-primary-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><EditIcon className="w-4 h-4" /></button>
                 <button onClick={() => onDelete(subject.id)} className="p-1.5 text-slate-500 hover:text-red-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><TrashIcon className="w-4 h-4" /></button>
            </div>
        </li>
    );
};


export const SubjectManager: React.FC<SubjectManagerProps> = ({ subjects, setSubjects, notes, setNotes, showToast, showModal }) => {
    const [newSubjectName, setNewSubjectName] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleAddSubject = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = newSubjectName.trim();
        if (!trimmedName) return;

        if (subjects.some(s => s.name.toLowerCase() === trimmedName.toLowerCase())) {
            showToast('이미 존재하는 과목입니다.', 'error');
            return;
        }

        const newSubject: Subject = {
            id: Date.now().toString(),
            name: trimmedName,
            count: 0,
        };
        setSubjects(prev => [...prev, newSubject]);
        setNewSubjectName('');
        showToast('과목이 추가되었습니다.', 'success');
    };
    
    const handleUpdateSubject = (id: string, newName: string) => {
      if (subjects.some(s => s.id !== id && s.name.toLowerCase() === newName.toLowerCase())) {
          showToast('이미 존재하는 과목 이름입니다.', 'error');
          return;
      }
      setSubjects(subjects.map(s => s.id === id ? { ...s, name: newName } : s));
      showToast('과목 이름이 수정되었습니다.', 'success');
    };

    const handleDeleteSubject = (id: string) => {
        const subjectToDelete = subjects.find(s => s.id === id);
        if (!subjectToDelete) return;

        showModal(
            '과목 삭제',
            `'${subjectToDelete.name}' 과목을 삭제하시겠습니까? 관련 오답노트도 모두 삭제됩니다.`,
            () => {
                setDeletingId(id);
                setTimeout(() => {
                    setSubjects(prev => prev.filter(s => s.id !== id));
                    setNotes(prev => prev.filter(n => n.subjectId !== id));
                    showToast('과목이 삭제되었습니다.', 'success');
                    setDeletingId(null);
                }, 300);
            }
        );
    };
    
    const handleIncrement = (id: string) => {
        const subject = subjects.find(s => s.id === id);
        if(subject) {
            setSubjects(subjects.map(s => s.id === id ? { ...s, count: s.count + 1 } : s));
            showToast(`${subject.name} ${subject.count + 1}회독 완료!`, 'success');
        }
    };

    const handleDecrement = (id: string) => {
        const subject = subjects.find(s => s.id === id);
        if(subject) {
            if (subject.count > 0) {
                setSubjects(subjects.map(s => s.id === id ? { ...s, count: s.count - 1 } : s));
            } else {
                showToast('회독 횟수는 0 미만이 될 수 없습니다.', 'error');
            }
        }
    };

    return (
        <Card title="과목 관리" icon={<BookOpenIcon className="w-6 h-6" />} className="animate-card-pop-in">
            <form onSubmit={handleAddSubject} className="flex gap-2">
                <input
                    type="text"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    placeholder="예: 행정법, 한국사"
                    className="flex-grow w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition"
                />
                <button type="submit" className="flex-shrink-0 bg-brand-primary-500 text-white font-bold p-2.5 rounded-lg hover:bg-brand-primary-600 transition-all transform hover:scale-105 disabled:opacity-50" disabled={!newSubjectName.trim()}>
                    <PlusIcon className="w-5 h-5" />
                </button>
            </form>
            <div className="min-h-[100px]">
                {subjects.length > 0 ? (
                    <ul className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {subjects.map((subject, index) => (
                            <SubjectItem 
                                key={subject.id} 
                                subject={subject}
                                onUpdate={handleUpdateSubject}
                                onDelete={handleDeleteSubject}
                                onIncrement={handleIncrement}
                                onDecrement={handleDecrement}
                                index={index}
                                deletingId={deletingId}
                            />
                        ))}
                    </ul>
                ) : (
                     <EmptyState 
                        icon={<BookOpenIcon className="w-8 h-8" />}
                        title="과목 없음"
                        description="첫 과목을 추가하여 학습을 시작해보세요."
                    />
                )}
            </div>
        </Card>
    );
};
