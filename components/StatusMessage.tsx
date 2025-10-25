import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface StatusMessageProps {
    message: string;
    type: 'info' | 'recording' | 'processing' | 'success' | 'error';
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message, type }) => {
    const { t } = useLanguage();

    if (!message) return null;

    const baseClasses = "p-4 rounded-xl text-center font-medium mb-8";
    const typeClasses = {
        info: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
        recording: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 animate-pulse",
        processing: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200",
        success: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200",
        error: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200"
    };

    const translatedMessage = t(message as any);

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            {translatedMessage}
        </div>
    );
};

export default StatusMessage;
