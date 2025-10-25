import React from 'react';
import { SpeakerInfo } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SpeakerFormProps {
    speakerInfo: SpeakerInfo;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const SpeakerForm: React.FC<SpeakerFormProps> = ({ speakerInfo, onChange }) => {
    const { t } = useLanguage();
    return (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{t('speakerInfoTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="id" className="block text-right text-sm font-medium text-gray-700 dark:text-gray-300">{t('speakerIdLabel')}</label>
                    <input type="text" id="id" value={speakerInfo.id} onChange={onChange} className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500" required />
                </div>
                <div>
                    <label htmlFor="placeOfBirth" className="block text-right text-sm font-medium text-gray-700 dark:text-gray-300">{t('placeOfBirthLabel')}</label>
                    <input type="text" id="placeOfBirth" value={speakerInfo.placeOfBirth} onChange={onChange} className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500" required />
                </div>
                <div>
                    <label htmlFor="gender" className="block text-right text-sm font-medium text-gray-700 dark:text-gray-300">{t('genderLabel')}</label>
                    <select id="gender" value={speakerInfo.gender} onChange={onChange} className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500">
                        <option value="Male">{t('genderMale')}</option>
                        <option value="Female">{t('genderFemale')}</option>
                        <option value="Other">{t('genderOther')}</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="age" className="block text-right text-sm font-medium text-gray-700 dark:text-gray-300">{t('ageLabel')}</label>
                    <input type="number" id="age" value={speakerInfo.age} onChange={onChange} className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500" required />
                </div>
            </div>
        </div>
    );
};

export default SpeakerForm;
