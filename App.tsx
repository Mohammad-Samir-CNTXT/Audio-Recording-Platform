import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { SpeakerInfo, RecordingMetadata, ReviewableRecording, UserRole } from './types';
import { convertToWav, blobToDataURL } from './services/audioService';
import SpeakerForm from './components/SpeakerForm';
import TranscriptDisplay from './components/TranscriptDisplay';
import Controls from './components/Controls';
import StatusMessage from './components/StatusMessage';
import MetadataDisplay from './components/MetadataDisplay';
import Login from './components/Login';
import ReviewTab from './components/ReviewTab';
import AdminDashboard from './components/AdminDashboard';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';
import { translations } from './i18n/translations';

const SunIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);

const MoonIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);

const getUsernameFromEmail = (email: string) => {
    return email.split('@')[0].toLowerCase();
}

const App: React.FC = () => {
    const { t, language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
    const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [speakerInfo, setSpeakerInfo] = useState<SpeakerInfo>({
        id: '',
        placeOfBirth: '',
        gender: 'Male',
        age: ''
    });

    const [paragraphs, setParagraphs] = useState<string[]>([]);
    const [paragraphIndex, setParagraphIndex] = useState(0);
    const [isLoadingParagraphs, setIsLoadingParagraphs] = useState(false);
    const [allParagraphsLoaded, setAllParagraphsLoaded] = useState(false);
    const paragraphFileIndex = useRef(1);

    const [isRecording, setIsRecording] = useState(false);
    const [status, setStatus] = useState<{ message: string; type: 'info' | 'recording' | 'processing' | 'success' | 'error' }>({ message: '', type: 'info' });
    const [metadata, setMetadata] = useState<RecordingMetadata | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [metadataUrl, setMetadataUrl] = useState<string | null>(null);
    const [recordingsCount, setRecordingsCount] = useState(0);
    const [activeTab, setActiveTab] = useState<'record' | 'review' | 'admin'>('record');
    const [recordingsForReview, setRecordingsForReview] = useState<ReviewableRecording[]>([]);
    const [acceptedTranscripts, setAcceptedTranscripts] = useState<string[]>([]);
    const [skippedTranscripts, setSkippedTranscripts] = useState<string[]>([]);


    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const availableParagraphs = useMemo(() => {
        const acceptedSet = new Set(acceptedTranscripts.map(p => p.trim()));
        const skippedSet = new Set(skippedTranscripts.map(p => p.trim()));
        return paragraphs.filter(p => {
            const trimmedP = p.trim();
            return !acceptedSet.has(trimmedP) && !skippedSet.has(trimmedP);
        });
    }, [paragraphs, acceptedTranscripts, skippedTranscripts]);


    useEffect(() => {
        document.title = t('appTitle');
    }, [t]);

    const resetParagraphs = () => {
        setParagraphs([]);
        setParagraphIndex(0);
        paragraphFileIndex.current = 1;
        setAllParagraphsLoaded(false);
        setIsLoadingParagraphs(false); // Reset loading state
    };

    const handleLogin = (email: string) => {
        const lowerCaseEmail = email.trim().toLowerCase();
        let allUserData: any = {};
        try {
            allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        } catch (error) {
            console.error("Failed to parse user data from localStorage, resetting.", error);
            localStorage.removeItem('userData');
        }
        
        const isFirstUser = Object.keys(allUserData).length === 0;

        let userData = allUserData[lowerCaseEmail];
        let userRole: UserRole;

        if (userData) {
            userRole = userData.role || 'voice actor';
        } else {
            // New user
            userRole = isFirstUser ? 'admin' : 'voice actor';
            userData = {
                role: userRole,
                recordingsCount: 0,
                speakerInfo: { id: '', placeOfBirth: '', gender: 'Male', age: '' },
                recordings: [],
                acceptedTranscripts: [],
                skippedTranscripts: []
            };
        }

        // Always ensure m.samirwords@gmail.com is an admin
        if (lowerCaseEmail === 'm.samirwords@gmail.com') {
            userRole = 'admin';
            userData.role = 'admin'; // Ensure the data to be saved reflects this
        }

        allUserData[lowerCaseEmail] = userData;
        localStorage.setItem('userData', JSON.stringify(allUserData));

        setRecordingsCount(userData.recordingsCount);
        setSpeakerInfo(userData.speakerInfo);
        setAcceptedTranscripts(userData.acceptedTranscripts || []);
        setSkippedTranscripts(userData.skippedTranscripts || []);
        setCurrentUserEmail(lowerCaseEmail);
        setCurrentUserRole(userRole);
        localStorage.setItem('currentUserEmail', lowerCaseEmail);

        if (userRole === 'admin' || userRole === 'reviewer') {
            const allPendingRecordings: ReviewableRecording[] = [];
            Object.values(allUserData).forEach((u: any) => {
                if (u.recordings) {
                    allPendingRecordings.push(...u.recordings.filter((r: ReviewableRecording) => r.status === 'pending'));
                }
            });
            setRecordingsForReview(allPendingRecordings);
        } else {
            setRecordingsForReview([]);
        }

        resetParagraphs();
        setActiveTab('record');
    };

    useEffect(() => {
        const savedEmail = localStorage.getItem('currentUserEmail');
        if (savedEmail) {
            handleLogin(savedEmail);
        }
        setIsDataLoaded(true);
    }, []);

    useEffect(() => {
        if (currentUserEmail) {
            let allUserData: any = {};
            try {
                allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
            } catch (error) {
                console.error("Failed to parse user data from localStorage.", error);
            }
            const currentUserData = allUserData[currentUserEmail] || {};
            
            const updatedData = {
                ...allUserData,
                [currentUserEmail]: {
                    ...currentUserData,
                    recordingsCount: recordingsCount,
                    speakerInfo: speakerInfo,
                    role: currentUserRole,
                    acceptedTranscripts: acceptedTranscripts,
                    skippedTranscripts: skippedTranscripts
                    // recordings are now managed by accept/reject/processRecording functions directly
                }
            };

            localStorage.setItem('userData', JSON.stringify(updatedData));
        }
    }, [recordingsCount, speakerInfo, currentUserEmail, acceptedTranscripts, skippedTranscripts, currentUserRole]);

    const loadParagraphs = useCallback(async (email: string) => {
        if (allParagraphsLoaded || isLoadingParagraphs) return;

        setIsLoadingParagraphs(true);
        setStatus({ message: 'statusLoadingParagraphs', type: 'info' });
        
        const username = getUsernameFromEmail(email);
        const filePath = `/${username}-${paragraphFileIndex.current}.json`;

        try {
            const response = await fetch(filePath);
            if (response.status === 404) {
                setAllParagraphsLoaded(true);
                setStatus({ message: '', type: 'info' }); // Clear loading message
                return;
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const newParagraphs: string[] = await response.json();
            
            setParagraphs(prev => {
                const existing = new Set(prev);
                const uniqueNew = newParagraphs.filter(p => !existing.has(p));
                return [...prev, ...uniqueNew];
            });

            paragraphFileIndex.current += 1;
            setStatus({ message: '', type: 'info' });
        } catch (error) {
            console.error('Failed to fetch paragraphs:', error);
            setStatus({ message: 'statusParagraphsError', type: 'error' });
        } finally {
            setIsLoadingParagraphs(false);
        }
    }, [allParagraphsLoaded, isLoadingParagraphs]);

    useEffect(() => {
        if(currentUserEmail && paragraphs.length === 0 && !isLoadingParagraphs && !allParagraphsLoaded){
            loadParagraphs(currentUserEmail);
        }
    }, [currentUserEmail, paragraphs.length, isLoadingParagraphs, allParagraphsLoaded, loadParagraphs]);

    useEffect(() => {
        if (currentUserEmail && !isLoadingParagraphs && !allParagraphsLoaded && availableParagraphs.length === 0 && paragraphs.length > 0) {
            loadParagraphs(currentUserEmail);
        }
    }, [currentUserEmail, isLoadingParagraphs, allParagraphsLoaded, availableParagraphs.length, paragraphs.length, loadParagraphs]);

    useEffect(() => {
        if (allParagraphsLoaded && availableParagraphs.length === 0) {
            setStatus({ message: 'statusNoNewParagraphs', type: 'info' });
        }
    }, [allParagraphsLoaded, availableParagraphs.length]);

    useEffect(() => {
        if (paragraphIndex >= availableParagraphs.length && availableParagraphs.length > 0) {
            setParagraphIndex(0);
        }
    }, [availableParagraphs.length, paragraphIndex]);


    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setSpeakerInfo(prev => ({ ...prev, [id]: value }));
    }, []);

    const handleLogout = () => {
        setCurrentUserEmail(null);
        setCurrentUserRole(null);
        localStorage.removeItem('currentUserEmail');
        setRecordingsCount(0);
        setSpeakerInfo({ id: '', placeOfBirth: '', gender: 'Male', age: '' });
        setRecordingsForReview([]);
        setAcceptedTranscripts([]);
        setSkippedTranscripts([]);
        setMetadata(null);
        setAudioUrl(null);
        setMetadataUrl(null);
        setStatus({ message: '', type: 'info' });
        setActiveTab('record');
        resetParagraphs();
    };
    
    const cleanup = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current = null;
        }
    };
    
    const processRecording = async () => {
        if (audioChunksRef.current.length === 0 || !currentUserEmail) return;
        
        setStatus({ message: 'statusProcessing', type: 'processing' });

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];

        try {
            const wavBlob = await convertToWav(audioBlob, 44100, 16);
            const recordingId = `${speakerInfo.id || 'speaker'}_p${paragraphIndex}_${Date.now()}`;
            
            const tempAudio = new Audio(URL.createObjectURL(wavBlob));
            tempAudio.onloadedmetadata = async () => {
                const duration = tempAudio.duration;
                const newMetadata: RecordingMetadata = {
                    id: recordingId,
                    speaker: {
                        id: speakerInfo.id,
                        place_of_birth: speakerInfo.placeOfBirth,
                        gender: speakerInfo.gender,
                        age: parseInt(speakerInfo.age, 10) || 0,
                    },
                    audio: {
                        fileName: `${recordingId}.wav`,
                        sampleRate: 44100,
                        bitDepth: 16,
                        channels: "Mono",
                        durationSeconds: parseFloat(duration.toFixed(2))
                    },
                    transcript: availableParagraphs[paragraphIndex].trim()
                };

                const audioDataUrl = await blobToDataURL(wavBlob);
                const newRecording: ReviewableRecording = {
                    metadata: newMetadata,
                    audioDataUrl: audioDataUrl,
                    status: 'pending',
                    recorderEmail: currentUserEmail
                };
                
                let allUserData: any = {};
                try {
                    allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
                } catch (error) {
                    console.error("Failed to parse user data from localStorage.", error);
                }

                const currentUserData = allUserData[currentUserEmail];
                if (!currentUserData) {
                     console.error(`Could not find user data for ${currentUserEmail}`);
                     setStatus({ message: 'statusConversionError', type: 'error' });
                     return;
                }
                
                currentUserData.recordings.push(newRecording);
                currentUserData.recordingsCount = (currentUserData.recordingsCount || 0) + 1;
                localStorage.setItem('userData', JSON.stringify(allUserData));
                
                setRecordingsCount(prevCount => prevCount + 1);

                setMetadata(newMetadata);
                setAudioUrl(URL.createObjectURL(wavBlob));
                const metadataString = JSON.stringify(newMetadata, null, 2);
                const metadataBlob = new Blob([metadataString], { type: 'application/json' });
                setMetadataUrl(URL.createObjectURL(metadataBlob));

                setStatus({ message: 'statusSuccess', type: 'success' });
            };
            tempAudio.onerror = () => {
                 setStatus({ message: 'statusDurationError', type: 'error' });
            }

        } catch (error) {
            console.error('Failed to process audio:', error);
            setStatus({ message: 'statusConversionError', type: 'error' });
        }
    };

    const handleStopRecording = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            cleanup();
            setIsRecording(false);
            setStatus({ message: 'statusProcessing', type: 'processing' });
        }
    }, []);

    const handleStartRecording = useCallback(async () => {
        if (!speakerInfo.id || !speakerInfo.placeOfBirth || !speakerInfo.age) {
            alert(t('alertFillFields'));
            return;
        }
        
        setMetadata(null);
        setAudioUrl(null);
        setMetadataUrl(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.addEventListener('dataavailable', (event: BlobEvent) => {
                audioChunksRef.current.push(event.data);
            });

            mediaRecorderRef.current.addEventListener('stop', processRecording);

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setStatus({ message: 'statusRecording', type: 'recording' });
            
            timerRef.current = setTimeout(() => {
                handleStopRecording();
                setStatus(prev => ({...prev, message: 'statusAutoStopped', type: 'success'}));
            }, 70000);

        } catch (error) {
            console.error('Error accessing microphone:', error);
            setStatus({ message: 'statusMicError', type: 'error' });
        }
    }, [speakerInfo, t, handleStopRecording, processRecording]);

    const handleLoadNextParagraph = useCallback(() => {
        if (availableParagraphs.length === 0 || !currentUserEmail) return;
    
        const nextIndex = paragraphIndex + 1;
    
        if (nextIndex >= availableParagraphs.length) {
            if (allParagraphsLoaded) {
                 if (availableParagraphs.length > 0) setParagraphIndex(0); // Loop back if all loaded and list is not empty
            }
        } else {
            setParagraphIndex(nextIndex);
        }
    
        // Pre-fetch next chunk if we're getting close to the end
        if (!isLoadingParagraphs && !allParagraphsLoaded && nextIndex >= availableParagraphs.length - 5) {
            loadParagraphs(currentUserEmail);
        }
    
        setMetadata(null);
        setAudioUrl(null);
        setMetadataUrl(null);
        setStatus({ message: '', type: 'info' });
    }, [paragraphIndex, availableParagraphs.length, allParagraphsLoaded, loadParagraphs, currentUserEmail, isLoadingParagraphs]);


    const handleSkipParagraph = useCallback(() => {
        if (!availableParagraphs[paragraphIndex]) return;

        setSkippedTranscripts(prev => [...new Set([...prev, availableParagraphs[paragraphIndex].trim()])]);

        setMetadata(null);
        setAudioUrl(null);
        setMetadataUrl(null);
        setStatus({ message: '', type: 'info' });
    }, [availableParagraphs, paragraphIndex]);


    const handleReRecord = useCallback(() => {
        setMetadata(null);
        setAudioUrl(null);
        setMetadataUrl(null);
        setStatus({ message: 'statusReRecord', type: 'info' });
    }, []);

    const handleAcceptRecording = (id: string, recorderEmail: string) => {
        let acceptedTranscript: string | null = null;
        let allUserData: any = {};
        try {
            allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        } catch (error) {
            console.error("Failed to parse user data from localStorage.", error);
        }
        const recorderData = allUserData[recorderEmail];

        if (recorderData) {
            recorderData.recordings = recorderData.recordings.map((rec: ReviewableRecording) => {
                if (rec.metadata.id === id) {
                    acceptedTranscript = rec.metadata.transcript;
                    return { ...rec, status: 'accepted' };
                }
                return rec;
            });
            
            if (acceptedTranscript) {
                recorderData.acceptedTranscripts = recorderData.acceptedTranscripts || [];
                const trimmedTranscript = acceptedTranscript.trim();
                if (!recorderData.acceptedTranscripts.includes(trimmedTranscript)) {
                    recorderData.acceptedTranscripts.push(trimmedTranscript);
                }
            }

            localStorage.setItem('userData', JSON.stringify(allUserData));
        }

        setRecordingsForReview(prev => prev.filter(rec => rec.metadata.id !== id));
        setStatus({ message: 'recordingAccepted', type: 'success' });
    };

    const handleRejectRecording = (id: string, recorderEmail: string) => {
        let allUserData: any = {};
        try {
            allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        } catch (error) {
            console.error("Failed to parse user data from localStorage.", error);
        }
        const recorderData = allUserData[recorderEmail];
        if (recorderData) {
            const initialLength = recorderData.recordings.length;
            recorderData.recordings = recorderData.recordings.filter((rec: ReviewableRecording) => rec.metadata.id !== id);
             if (recorderData.recordings.length < initialLength) {
                recorderData.recordingsCount = (recorderData.recordingsCount || 1) - 1;
            }
            localStorage.setItem('userData', JSON.stringify(allUserData));
        }
        setRecordingsForReview(prev => prev.filter(rec => rec.metadata.id !== id));
        setStatus({ message: 'recordingRejected', type: 'error' });
    };
    
    if (!isDataLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="text-center">
                     <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">{t('loading')}</h1>
                </div>
            </div>
        );
    }

    if (!currentUserEmail) {
        return <Login onLogin={handleLogin} />;
    }
    
    const pendingReviewCount = recordingsForReview.length;
    const roleKey = `role${currentUserRole!.charAt(0).toUpperCase() + currentUserRole!.slice(1).replace(' ', '')}` as keyof typeof translations;


    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="max-w-3xl w-full mx-auto my-8 p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
                <header className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle theme">
                            {theme === 'light' ? <MoonIcon className="h-5 w-5"/> : <SunIcon className="h-5 w-5"/>}
                        </button>
                        <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="px-3 py-2 text-sm font-bold rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            {language === 'ar' ? 'EN' : 'AR'}
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block text-right">
                            {t('loggedInAs')} <span className="font-bold text-gray-800 dark:text-gray-200">{currentUserEmail} ({t(roleKey)})</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            {t('logout')}
                        </button>
                    </div>
                </header>

                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('appTitle')}</h1>
                </div>

                <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex justify-center space-x-4" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('record')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'record' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'}`}
                        >
                            {t('recordTab')}
                        </button>
                        {(currentUserRole === 'admin' || currentUserRole === 'reviewer') && (
                            <button
                                onClick={() => setActiveTab('review')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg relative ${activeTab === 'review' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'}`}
                            >
                                {t('reviewTab')}
                                {pendingReviewCount > 0 && (
                                    <span className="absolute top-3 -right-3 ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{pendingReviewCount}</span>
                                )}
                            </button>
                        )}
                        {currentUserRole === 'admin' && (
                            <button
                                onClick={() => setActiveTab('admin')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'admin' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'}`}
                            >
                                {t('adminDashboardTab')}
                            </button>
                        )}
                    </nav>
                </div>
                
                {activeTab === 'record' && (
                    <>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">{t('appDescription')}</p>
                        <div className="mb-8 p-4 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 font-bold rounded-2xl text-lg text-center border border-indigo-200 dark:border-indigo-800">
                            <span>📊</span> {t('completedRecordings')} {recordingsCount}
                        </div>

                        <SpeakerForm
                            speakerInfo={speakerInfo}
                            onChange={handleFormChange}
                        />

                        <TranscriptDisplay
                            text={availableParagraphs[paragraphIndex] || '...'}
                        />

                        <Controls
                            isRecording={isRecording}
                            onStart={handleStartRecording}
                            onStop={handleStopRecording}
                            onNext={handleLoadNextParagraph}
                            onSkip={handleSkipParagraph}
                            disabled={isLoadingParagraphs || availableParagraphs.length === 0}
                        />

                        <StatusMessage
                            message={status.message}
                            type={status.type}
                        />

                        {metadata && audioUrl && metadataUrl && (
                            <MetadataDisplay
                                metadata={metadata}
                                audioUrl={audioUrl}
                                metadataUrl={metadataUrl}
                                onReRecord={handleReRecord}
                            />
                        )}
                    </>
                )}

                {activeTab === 'review' && (
                     <ReviewTab
                        recordings={recordingsForReview}
                        onAccept={handleAcceptRecording}
                        onReject={handleRejectRecording}
                    />
                )}

                {activeTab === 'admin' && <AdminDashboard />}
            </div>
        </div>
    );
};

export default App;