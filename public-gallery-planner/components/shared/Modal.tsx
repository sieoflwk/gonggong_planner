
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
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
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md m-4 p-6 text-center space-y-4 transform transition-transform duration-300 scale-95 motion-safe:animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{children}</p>
                <div className="flex justify-center gap-4 pt-4">
                    <button 
                        onClick={onClose} 
                        className="px-6 py-2 rounded-lg font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                        취소
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="px-6 py-2 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById('portal')!
    );
};
