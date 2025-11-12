import React, { useRef } from 'react';
import { Card } from './shared/Card';
import { CogIcon, DownloadIcon, UploadIcon } from './shared/icons';

interface SettingsProps {
    onClearAllData: () => void;
    onBackup: () => void;
    onRestore: (data: string) => void;
    style?: React.CSSProperties;
}

export const Settings: React.FC<SettingsProps> = ({ onClearAllData, onBackup, onRestore, style }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result;
            if (typeof content === 'string') {
                onRestore(content);
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Same file can be selected again
    };

    return (
        <Card title="설정" icon={<CogIcon className="w-6 h-6" />} className="animate-card-pop-in" style={style}>
            <div className="space-y-3">
                 <button
                    onClick={onBackup}
                    className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-sky-600 transition-colors"
                >
                    <DownloadIcon className="w-5 h-5" />
                    데이터 백업
                </button>
                <button
                    onClick={handleRestoreClick}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                    <UploadIcon className="w-5 h-5" />
                    데이터 복구
                </button>
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                />
                <hr className="border-slate-200 dark:border-slate-700" />
                <button
                    onClick={onClearAllData}
                    className="w-full bg-red-500 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                    모든 데이터 삭제
                </button>
            </div>
        </Card>
    );
};