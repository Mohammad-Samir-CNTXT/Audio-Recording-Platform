import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ControlsProps {
    isRecording: boolean;
    onStart: () => void;
    onStop: () => void;
    onNext: () => void;
    disabled: boolean;
}

const Button: React.FC<{ onClick: () => void, disabled?: boolean, className: string, children: React.ReactNode }> = ({ onClick, disabled, className, children }) => (
    <button onClick={onClick} disabled={disabled} className={`px-6 py-3 rounded-xl font-bold transition-transform transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 ${className}`}>
        {children}
    </button>
);

const Controls: React.FC<ControlsProps> = ({ isRecording, onStart, onStop, onNext, disabled }) => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
            <Button onClick={onStart} disabled={isRecording || disabled} className="bg-blue-600 text-white hover:bg-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" />
                </svg>
                <span>{t('startRecording')}</span>
            </Button>
            <Button onClick={onStop} disabled={!isRecording} className="bg-red-600 text-white hover:bg-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1H9a1 1 0 01-1-1V7z" clipRule="evenodd" />
                </svg>
                <span>{t('stopAndSave')}</span>
            </Button>
            <Button onClick={onNext} disabled={isRecording || disabled} className="bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                   <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
                </svg>
                <span>{t('nextParagraph')}</span>
            </Button>
        </div>
    );
};

export default Controls;
