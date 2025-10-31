import React from 'react';
import { ReviewableRecording } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n/translations';

type TranslationKey = keyof typeof translations;

const getGenderTranslationKey = (gender: 'Male' | 'Female' | 'Other'): TranslationKey => {
    if (gender === 'Male') return 'genderMale';
    if (gender === 'Female') return 'genderFemale';
    return 'genderOther';
};

// FIX: Defined ReviewTabProps interface to resolve 'Cannot find name' error.
interface ReviewTabProps {
    recordings: ReviewableRecording[];
    onAccept: (id: string, recorderEmail: string) => void;
    onReject: (id: string, recorderEmail: string) => void;
}

const ReviewTab: React.FC<ReviewTabProps> = ({ recordings, onAccept, onReject }) => {
    const { t } = useLanguage();

    const pendingRecordings = recordings.filter(r => r.status === 'pending');

    if (pendingRecordings.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noRecordingsForReview')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-4">
                {t('reviewTabTitleWithCount').replace('{count}', pendingRecordings.length.toString())}
            </h2>
            {pendingRecordings.map((recording) => {
                const { metadata } = recording;

                return (
                    <div key={metadata.id} className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap justify-between items-center mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>{t('userEmail')}: {recording.recorderEmail}</span>
                            <span>{t('speakerIdLabel')}: {metadata.speaker.id}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-300 mb-3 border-t border-b border-gray-200 dark:border-gray-600 py-2">
                            <span><strong>{t('ageLabel')}:</strong> {metadata.speaker.age}</span>
                            <span><strong>{t('genderLabel')}:</strong> {t(getGenderTranslationKey(metadata.speaker.gender))}</span>
                            <span className="col-span-2 md:col-span-1"><strong>{t('placeOfBirthLabel')}:</strong> {metadata.speaker.place_of_birth}</span>
                        </div>

                        <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <span className="font-bold">{t('transcriptTitle')}: </span>
                            {metadata.transcript}
                        </p>
                        <div className="mb-4">
                             <audio controls src={recording.audioDataUrl} className="w-full dark:[color-scheme:dark]">
                                {t('audioUnsupported')}
                            </audio>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => onReject(recording.metadata.id, recording.recorderEmail)}
                                className="px-5 py-2 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-transform transform hover:scale-105"
                            >
                                {t('reject')}
                            </button>
                            <button
                                onClick={() => onAccept(recording.metadata.id, recording.recorderEmail)}
                                className="px-5 py-2 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-transform transform hover:scale-105"
                            >
                                {t('accept')}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ReviewTab;