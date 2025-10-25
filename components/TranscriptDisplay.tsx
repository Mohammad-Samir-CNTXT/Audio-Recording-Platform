import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TranscriptDisplayProps {
    text: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ text }) => {
    const { t } = useLanguage();
    return (
        <div className="bg-blue-50 dark:bg-blue-900/50 p-6 rounded-2xl mb-8 border border-blue-200 dark:border-blue-800">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">{t('transcriptTitle')}</h2>
            <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                {text}
            </p>
        </div>
    );
};

export default TranscriptDisplay;
