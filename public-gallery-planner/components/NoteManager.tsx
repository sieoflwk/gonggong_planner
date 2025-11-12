import React, { useState, useRef, useEffect } from 'react';
import { type Note, type Subject } from '../types';
import { Card, EmptyState } from './shared/Card';
import { EditIcon, TrashIcon, XMarkIcon, DocumentTextIcon } from './shared/icons';

interface NoteManagerProps {
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    subjects: Subject[];
    showToast: (message: string, type?: 'success' | 'error') => void;
    showModal: (title: string, content: string, onConfirm: () => void) => void;
}

export const NoteManager: React.FC<NoteManagerProps> = ({ notes, setNotes, subjects, showToast, showModal }) => {
    const [editingNote, setEditingNote] = useState<Partial<Note> | null>(null);
    const [subjectId, setSubjectId] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredNotes = notes.filter(note => {
        const subject = subjects.find(s => s.id === note.subjectId);
        const subjectName = subject ? subject.name.toLowerCase() : '';
        const noteContent = note.content.toLowerCase();
        const term = searchTerm.toLowerCase();
        return subjectName.includes(term) || noteContent.includes(term);
    });
    
    useEffect(() => {
        if(editingNote) {
            setSubjectId(editingNote.subjectId || '');
            setContent(editingNote.content || '');
            setImage(editingNote.image || null);
        }
    }, [editingNote]);

    const resetForm = () => {
        setEditingNote(null);
        setSubjectId('');
        setContent('');
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            showToast('이미지는 2MB를 초과할 수 없습니다.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => setImage(reader.result as string);
        reader.onerror = () => showToast('이미지를 읽는 데 실패했습니다.', 'error');
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subjectId || !content.trim()) {
            showToast('과목과 내용을 모두 입력해주세요.', 'error');
            return;
        }

        if (editingNote?.id) {
            setNotes(notes.map(n => n.id === editingNote.id ? { ...n, subjectId, content, image } : n));
            showToast('노트가 수정되었습니다.', 'success');
        } else {
            const newNote: Note = {
                id: Date.now().toString(),
                subjectId,
                content,
                image,
                createdAt: new Date().toISOString()
            };
            setNotes(prev => [newNote, ...prev]);
            showToast('노트가 저장되었습니다.', 'success');
        }
        resetForm();
    };

    const handleEdit = (note: Note) => {
        setEditingNote(note);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id: string) => {
        showModal('노트 삭제', '이 오답노트를 삭제하시겠습니까?', () => {
            setDeletingId(id);
            setTimeout(() => {
                setNotes(prev => prev.filter(n => n.id !== id));
                showToast('노트가 삭제되었습니다.', 'success');
                setDeletingId(null);
            }, 300);
        });
    };

    return (
        <Card title="오답노트" icon={<DocumentTextIcon className="w-6 h-6" />} className="animate-card-pop-in" style={{ animationDelay: '300ms', opacity: 0 }}>
            <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition"
                >
                    <option value="">과목 선택</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="오답 내용을 입력하세요..."
                    rows={4}
                    className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition"
                />
                <div className="flex items-center gap-4">
                    <label htmlFor="note-image-upload" className="cursor-pointer px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                        사진 첨부
                    </label>
                    <input id="note-image-upload" type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
                    {image && (
                        <div className="relative">
                            <img src={image} alt="Preview" className="h-16 w-16 object-cover rounded-lg" />
                            <button type="button" onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><XMarkIcon className="w-4 h-4" /></button>
                        </div>
                    )}
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-brand-primary-500 rounded-lg hover:bg-brand-primary-600 transition-all transform hover:scale-105">
                        {editingNote ? '노트 수정' : '노트 저장'}
                    </button>
                    {editingNote && (
                        <button type="button" onClick={resetForm} className="w-full px-4 py-2 font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-600 dark:hover:bg-slate-500 transition-colors">
                            취소
                        </button>
                    )}
                </div>
            </form>
            <div className="mt-6">
                <input
                    type="search"
                    placeholder="오답노트 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition"
                />
            </div>
            <div className="min-h-[150px] mt-4">
                {filteredNotes.length > 0 ? (
                    <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {filteredNotes.map((note, index) => {
                            const isDeleting = deletingId === note.id;
                            return (
                                <li 
                                    key={note.id} 
                                    className={`p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-3 transition-all duration-300 ${isDeleting ? 'animate-list-item-exit overflow-hidden' : 'animate-slide-up-fade'}`}
                                    style={isDeleting ? {} : { animationDelay: `${index * 50}ms`, opacity: 0 }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="font-bold text-brand-primary-600 dark:text-brand-primary-400">[{subjects.find(s => s.id === note.subjectId)?.name || '삭제된 과목'}]</span>
                                            <p className="text-xs text-slate-400">{new Date(note.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <button onClick={() => handleEdit(note)} className="p-1.5 text-slate-500 hover:text-brand-primary-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><EditIcon className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(note.id)} className="p-1.5 text-slate-500 hover:text-red-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{note.content}</p>
                                    {note.image && <img src={note.image} alt="Note attachment" className="mt-2 rounded-lg max-w-xs cursor-pointer" onClick={() => window.open(note.image)} />}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <EmptyState
                      icon={<DocumentTextIcon className="w-8 h-8" />}
                      title={notes.length === 0 ? "오답노트 없음" : "검색 결과 없음"}
                      description={notes.length === 0 ? "첫 오답노트를 작성하여 약점을 보완해보세요." : "다른 키워드로 검색해보세요."}
                    />
                )}
            </div>
        </Card>
    );
};
