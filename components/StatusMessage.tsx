import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface StatusMessageProps {
    message: string;
    type: 'info' | 'recording' | 'processing' | 'success' | 'error';
}

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

const RecordingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`text-red-500 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <circle cx="10" cy="10" r="8" className="animate-pulse" />
    </svg>
);


const ProcessingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const SuccessIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);


const StatusMessage: React.FC<StatusMessageProps> = ({ message, type }) => {
    const { t } = useLanguage();
    const [countdown, setCountdown] = useState(70);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | null = null;
        if (type === 'recording') {
            setCountdown(70);
            timer = setInterval(() => {
                setCountdown(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [type]);

    if (!message) return null;

    const baseClasses = "p-4 rounded-xl text-center font-medium mb-8 transition-all duration-300";
    const typeClasses = {
        info: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
        recording: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200",
        processing: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200",
        success: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200",
        error: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200"
    };

    const iconMap = {
        info: <InfoIcon className="h-6 w-6" />,
        recording: <RecordingIcon className="h-5 w-5" />,
        processing: <ProcessingIcon className="h-5 w-5" />,
        success: <SuccessIcon className="h-6 w-6" />,
        error: <ErrorIcon className="h-6 w-6" />,
    };

    const translatedMessage = t(message as any);
    let fullMessage = <span>{translatedMessage}</span>;

    if (type === 'recording') {
        const remainingText = t('remaining' as any).replace('{seconds}', countdown.toString());
        fullMessage = (
            <span>
                {translatedMessage} <span className="font-mono">({remainingText})</span>
            </span>
        );
    }

    return (
        <div className={`${baseClasses} ${typeClasses[type]} flex items-center justify-center gap-3`}>
            {iconMap[type]}
            {fullMessage}
        </div>
    );
};

export default StatusMessage;