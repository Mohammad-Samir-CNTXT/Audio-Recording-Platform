import React from 'react';
import { RecordingMetadata } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface MetadataDisplayProps {
    metadata: RecordingMetadata;
    audioUrl: string;
    metadataUrl: string;
    onReRecord: () => void;
}

const MetadataDisplay: React.FC<MetadataDisplayProps> = ({ metadata, audioUrl, metadataUrl, onReRecord }) => {
    const { t } = useLanguage();
    return (
        <div className="bg-green-50 dark:bg-green-900/50 p-6 rounded-2xl border border-green-200 dark:border-green-800 mt-8">
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-4">{t('metadataTitle')}</h2>
            
            <div className="mb-4">
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">{t('listenToRecording')}</h3>
                <audio controls src={audioUrl} className="w-full dark:[color-scheme:dark]">
                    {t('audioUnsupported')}
                </audio>
            </div>

            <pre className="bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-300 p-4 rounded-xl text-left overflow-x-auto text-sm mb-4" style={{ direction: 'ltr' }}>
                <code>{JSON.stringify(metadata, null, 2)}</code>
            </pre>
            <div className="flex flex-wrap gap-4 items-center">
                <a 
                    href={audioUrl} 
                    download={metadata.audio.fileName}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-transform transform hover:scale-105 bg-green-600 text-white hover:bg-green-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.293a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>{t('downloadWav')}</span>
                </a>
                <a 
                    href={metadataUrl} 
                    download={`${metadata.id}.json`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-transform transform hover:scale-105 bg-blue-600 text-white hover:bg-blue-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                         <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <span>{t('downloadJson')}</span>
                </a>
                <button
                    onClick={onReRecord}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-transform transform hover:scale-105 bg-yellow-500 text-white hover:bg-yellow-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.899 2.182.5.5 0 01-.866.5A6.002 6.002 0 005.026 9.5a6 6 0 009.283 4.29.5.5 0 01.866.5A7.002 7.002 0 015 14.899V17a1 1 0 11-2 0v-5a1 1 0 011-1h5a1 1 0 110 2H5.101a7.002 7.002 0 019.182-11.899.5.5 0 01-.866-.5A6.002 6.002 0 009.5 5.026 6 6 0 005.71 14.28a.5.5 0 01-.866-.5A7.002 7.002 0 014 6.101V3a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>{t('reRecord')}</span>
                </button>
            </div>
        </div>
    );
};

export default MetadataDisplay;
