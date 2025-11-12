import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [animationClass, setAnimationClass] = useState('animate-toast-in');
  
  useEffect(() => {
    if (toast) {
      setAnimationClass('animate-toast-in');
      const timer = setTimeout(() => {
        setAnimationClass('animate-toast-out');
      }, 2500);
      const dismissTimer = setTimeout(onDismiss, 3000);
      return () => {
        clearTimeout(timer);
        clearTimeout(dismissTimer);
      };
    }
  }, [toast, onDismiss]);

  if (!toast) return null;

  const bgColor = toast.type === 'success' 
    ? 'bg-green-500 dark:bg-green-600' 
    : 'bg-red-500 dark:bg-red-600';

  return ReactDOM.createPortal(
    <div 
      className={`fixed bottom-5 left-1/2 z-50 transform -translate-x-1/2 ${animationClass}`}
      role="alert"
      aria-live="assertive"
    >
      <div className={`${bgColor} text-white font-semibold py-3 px-6 rounded-lg shadow-lg flex items-center`}>
        {toast.message}
      </div>
    </div>,
    document.getElementById('portal')!
  );
};
