import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginProps {
    onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !email.includes('@')) {
            setError(t('emailError'));
            return;
        }
        setError('');
        onLogin(email.trim());
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
            <div className="max-w-md w-full mx-auto my-8 p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('loginTitle')}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">{t('loginDescription')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-right text-sm font-medium text-gray-700 dark:text-gray-300">{t('emailLabel')}</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm p-3 focus:border-blue-500 focus:ring-blue-500 text-left"
                            required
                            placeholder={t('emailPlaceholder')}
                            dir="ltr"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                        >
                            {t('loginButton')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
