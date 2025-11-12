import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { type Theme, type Subject, type Todo, type Note, type CustomWord } from './types';
import { LOCAL_STORAGE_KEY, VOCABULARY } from './constants';
import { Header } from './components/Header';
import { SubjectManager } from './components/SubjectManager';
import { TodoList } from './components/TodoList';
import { VocabManager } from './components/VocabManager';
import { NoteManager } from './components/NoteManager';
import { DDayCounter } from './components/DDayCounter';
import { TodayWord } from './components/TodayWord';
import { Settings } from './components/Settings';
import { Modal } from './components/shared/Modal';
import { Toast, type ToastMessage } from './components/shared/Toast';
import { HelpModal } from './components/HelpModal';
import { StatsModal } from './components/StatsModal';

interface AppState {
    subjects: Subject[];
    todos: Todo[];
    notes: Note[];
    customWords: CustomWord[];
    examDate1: string | null;
    examDate2: string | null;
}

const getInitialState = (): AppState => ({
    subjects: [],
    todos: [],
    notes: [],
    customWords: [],
    examDate1: null,
    examDate2: null,
});

export default function App() {
    const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
    const [appState, setAppState] = useLocalStorage<AppState>(LOCAL_STORAGE_KEY, getInitialState());

    const [modal, setModal] = useState<{ isOpen: boolean; title: string; content: string; onConfirm: () => void }>({
        isOpen: false, title: '', content: '', onConfirm: () => {}
    });
    const [toast, setToast] = useState<ToastMessage | null>(null);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type, id: Date.now() });
    }, []);

    const showModal = useCallback((title: string, content: string, onConfirm: () => void) => {
        setModal({ isOpen: true, title, content, onConfirm });
    }, []);

    const handleClearAllData = () => {
        showModal(
            '모든 데이터 삭제',
            '정말로 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
            () => {
                setAppState(getInitialState());
                showToast('모든 데이터가 삭제되었습니다.', 'success');
            }
        );
    };

    const handleBackupData = () => {
        try {
            const dataStr = JSON.stringify(appState, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const date = new Date().toISOString().slice(0, 10);
            link.download = `gong-gallery-planner-backup-${date}.json`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            showToast('데이터가 성공적으로 백업되었습니다.', 'success');
        } catch (error) {
            console.error('Backup failed:', error);
            showToast('데이터 백업에 실패했습니다.', 'error');
        }
    };

    const handleRestoreData = (fileContent: string) => {
        try {
            const data = JSON.parse(fileContent);
            if (typeof data !== 'object' || data === null || !('subjects' in data && 'todos' in data && 'notes' in data && 'customWords' in data)) {
                 throw new Error('Invalid file format');
            }
            
            showModal(
                '데이터 복구',
                '데이터를 복구하시겠습니까? 현재 데이터는 백업 파일로 덮어쓰여집니다.',
                () => {
                    const restoredState = { ...getInitialState(), ...data };
                    setAppState(restoredState);
                    showToast('데이터가 성공적으로 복구되었습니다.', 'success');
                }
            );
        } catch (error) {
            console.error('Restore failed:', error);
            showToast('데이터 복구에 실패했습니다. 유효한 파일인지 확인해주세요.', 'error');
        }
    };
    
    const sortedNotes = useMemo(() => {
        return [...appState.notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [appState.notes]);
    
    const setSubjects = (updater: React.SetStateAction<Subject[]>) => setAppState(prev => ({ ...prev, subjects: typeof updater === 'function' ? updater(prev.subjects) : updater }));
    const setTodos = (updater: React.SetStateAction<Todo[]>) => setAppState(prev => ({ ...prev, todos: typeof updater === 'function' ? updater(prev.todos) : updater }));
    const setNotes = (updater: React.SetStateAction<Note[]>) => setAppState(prev => ({ ...prev, notes: typeof updater === 'function' ? updater(prev.notes) : updater }));
    const setCustomWords = (updater: React.SetStateAction<CustomWord[]>) => setAppState(prev => ({ ...prev, customWords: typeof updater === 'function' ? updater(prev.customWords) : updater }));
    const setExamDate1 = (date: string | null) => setAppState(prev => ({...prev, examDate1: date}));
    const setExamDate2 = (date: string | null) => setAppState(prev => ({...prev, examDate2: date}));


    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <Header 
                theme={theme} 
                onThemeToggle={handleThemeToggle} 
                onHelpClick={() => setIsHelpModalOpen(true)}
                onStatsClick={() => setIsStatsModalOpen(true)}
            />
            <main className="container mx-auto p-4 lg:p-6">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <main className="lg:col-span-2 flex flex-col gap-6">
                       <SubjectManager
                          subjects={appState.subjects}
                          setSubjects={setSubjects}
                          notes={appState.notes}
                          setNotes={setNotes}
                          showToast={showToast}
                          showModal={showModal}
                        />
                        <TodoList
                          todos={appState.todos}
                          setTodos={setTodos}
                          showToast={showToast}
                        />
                        <VocabManager 
                            customWords={appState.customWords}
                            setCustomWords={setCustomWords}
                            showToast={showToast}
                            showModal={showModal}
                        />
                         <NoteManager
                            notes={sortedNotes}
                            setNotes={setNotes}
                            subjects={appState.subjects}
                            showToast={showToast}
                            showModal={showModal}
                        />
                    </main>
                    <aside className="flex flex-col gap-6 lg:sticky lg:top-24 self-start">
                        <DDayCounter 
                            examDate1={appState.examDate1}
                            setExamDate1={setExamDate1}
                            examDate2={appState.examDate2}
                            setExamDate2={setExamDate2}
                            showToast={showToast}
                        />
                         <TodayWord 
                            customWords={appState.customWords}
                            builtInVocabulary={VOCABULARY}
                        />
                        <Settings 
                            onClearAllData={handleClearAllData}
                            onBackup={handleBackupData}
                            onRestore={handleRestoreData}
                            style={{ animationDelay: '400ms', opacity: 0 }}
                        />
                    </aside>
                </div>
            </main>
            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={() => {
                    modal.onConfirm();
                    setModal({ ...modal, isOpen: false });
                }}
                title={modal.title}
            >
                {modal.content}
            </Modal>
            <HelpModal 
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
            />
            <StatsModal 
                isOpen={isStatsModalOpen}
                onClose={() => setIsStatsModalOpen(false)}
                subjects={appState.subjects}
                todos={appState.todos}
                notes={appState.notes}
                customWords={appState.customWords}
            />
            <Toast toast={toast} onDismiss={() => setToast(null)} />
        </div>
    );
}