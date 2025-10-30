

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { UserRole } from '../types';
import { translations } from '../i18n/translations';

type TranslationKey = keyof typeof translations;

interface User {
    email: string;
    role: UserRole;
}

interface Feedback {
    messageKey: TranslationKey;
    type: 'success' | 'error';
}


const AdminDashboard: React.FC = () => {
    const { t } = useLanguage();
    const [users, setUsers] = useState<User[]>([]);
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState<UserRole | ''>('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);


    useEffect(() => {
        let allUserData: any = {};
        try {
            allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
        }
        const userList: User[] = Object.keys(allUserData).map(email => ({
            email,
            role: allUserData[email].role || 'voice actor' // Default to voice actor if role not set
        }));
        setUsers(userList);
        setCurrentUserEmail(localStorage.getItem('currentUserEmail'));
    }, []);
    
    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);

        if (!newUserEmail || !newUserEmail.includes('@')) {
            setFeedback({ messageKey: 'invalidEmailError', type: 'error' });
            return;
        }
        if (!newUserRole) {
            setFeedback({ messageKey: 'roleRequiredError', type: 'error' });
            return;
        }

        let allUserData: any = {};
        try {
            allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
        }
        const finalEmail = newUserEmail.trim().toLowerCase();

        if (allUserData[finalEmail]) {
            setFeedback({ messageKey: 'emailExistsError', type: 'error' });
            return;
        }

        allUserData[finalEmail] = {
            role: newUserRole,
            recordingsCount: 0,
            speakerInfo: { id: '', placeOfBirth: '', gender: 'Male', age: '' },
            recordings: [],
            acceptedTranscripts: []
        };
        localStorage.setItem('userData', JSON.stringify(allUserData));

        setUsers(prevUsers => [...prevUsers, { email: finalEmail, role: newUserRole as UserRole }]);
        setNewUserEmail('');
        setNewUserRole('');
        setFeedback({ messageKey: 'userAddedSuccess', type: 'success' });
    };


    const handleRoleChange = (email: string, newRole: UserRole) => {
        let allUserData: any = {};
        try {
            allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
        }
        
        const admins = users.filter(user => user.role === 'admin');
        if (admins.length === 1 && admins[0].email === email && newRole !== 'admin') {
            alert('Cannot remove the last admin.');
            return;
        }

        if (allUserData[email]) {
            allUserData[email].role = newRole;
            localStorage.setItem('userData', JSON.stringify(allUserData));
            setUsers(prevUsers => prevUsers.map(user => 
                user.email === email ? { ...user, role: newRole } : user
            ));
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('addUserSectionTitle')}</h3>
                <form onSubmit={handleAddUser} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                             <label htmlFor="newUserEmail" className="sr-only">{t('emailLabel')}</label>
                             <input
                                type="email"
                                id="newUserEmail"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 text-left"
                                placeholder={t('emailPlaceholder')}
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label htmlFor="newUserRole" className="sr-only">{t('userRole')}</label>
                            <select
                                id="newUserRole"
                                value={newUserRole}
                                onChange={(e) => setNewUserRole(e.target.value as UserRole | '')}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="" disabled>{t('selectRolePrompt')}</option>
                                <option value="admin">{t('roleAdmin')}</option>
                                <option value="reviewer">{t('roleReviewer')}</option>
                                <option value="voice actor">{t('roleVoiceActor')}</option>
                            </select>
                        </div>
                    </div>
                     {feedback && (
                        <p className={`text-sm text-center ${feedback.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {t(feedback.messageKey)}
                        </p>
                    )}
                    <button type="submit" className="w-full sm:w-auto px-6 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-transform transform hover:scale-105">
                        {t('addUserButton')}
                    </button>
                </form>
            </div>
            
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-4">{t('adminDashboardTitle')}</h2>
                {users.length === 0 ? (
                     <p className="text-center text-gray-500 dark:text-gray-400">{t('noUsersFound')}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${document.documentElement.dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('userEmail')}</th>
                                    <th scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${document.documentElement.dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('userRole')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {users.map(user => (
                                    <tr key={user.email}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.email, e.target.value as UserRole)}
                                                className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                                                disabled={user.email === currentUserEmail && users.filter(u => u.role === 'admin').length === 1}
                                            >
                                                <option value="admin">{t('roleAdmin')}</option>
                                                <option value="reviewer">{t('roleReviewer')}</option>
                                                <option value="voice actor">{t('roleVoiceActor')}</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;