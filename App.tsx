

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SpeakerInfo, RecordingMetadata, ReviewableRecording } from './types';
import { convertToWav, blobToDataURL } from './services/audioService';
import SpeakerForm from './components/SpeakerForm';
import TranscriptDisplay from './components/TranscriptDisplay';
import Controls from './components/Controls';
import StatusMessage from './components/StatusMessage';
import MetadataDisplay from './components/MetadataDisplay';
import Login from './components/Login';
import ReviewTab from './components/ReviewTab';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';

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
    const [activeTab, setActiveTab] = useState<'record' | 'review'>('record');
    const [recordingsForReview, setRecordingsForReview] = useState<ReviewableRecording[]>([]);


    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        const allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userData = allUserData[email] || {
            recordingsCount: 0,
            speakerInfo: { id: '', placeOfBirth: '', gender: 'Male', age: '' },
            recordings: []
        };

        setRecordingsCount(userData.recordingsCount);
        setSpeakerInfo(userData.speakerInfo);
        setRecordingsForReview(userData.recordings);
        setCurrentUserEmail(email);
        localStorage.setItem('currentUserEmail', email);
        resetParagraphs();
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
            const allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
            const currentUserData = allUserData[currentUserEmail] || {};
            
            const updatedData = {
                ...allUserData,
                [currentUserEmail]: {
                    ...currentUserData,
                    recordingsCount: recordingsCount,
                    speakerInfo: speakerInfo,
                    recordings: recordingsForReview
                }
            };

            localStorage.setItem('userData', JSON.stringify(updatedData));
        }
    }, [recordingsCount, speakerInfo, currentUserEmail, recordingsForReview]);

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
                if (paragraphFileIndex.current === 1 && paragraphs.length === 0) {
                     console.error(`Initial paragraph file not found for user ${username}.`);
                     setStatus({ message: 'statusParagraphsError', type: 'error' });
                } else {
                     setStatus({ message: '', type: 'info' });
                }
                return;
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const newParagraphs: string[] = await response.json();
            setParagraphs(prev => [...prev, ...newParagraphs]);
            paragraphFileIndex.current += 1;
            setStatus({ message: '', type: 'info' });
        } catch (error) {
            console.error('Failed to fetch paragraphs:', error);
            setStatus({ message: 'statusParagraphsError', type: 'error' });
        } finally {
            setIsLoadingParagraphs(false);
        }
    }, [allParagraphsLoaded, isLoadingParagraphs, paragraphs.length]);

    useEffect(() => {
        if(currentUserEmail && paragraphs.length === 0 && !isLoadingParagraphs && !allParagraphsLoaded){
            loadParagraphs(currentUserEmail);
        }
    }, [currentUserEmail, loadParagraphs, paragraphs.length, isLoadingParagraphs, allParagraphsLoaded]);


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
        localStorage.removeItem('currentUserEmail');
        setRecordingsCount(0);
        setSpeakerInfo({ id: '', placeOfBirth: '', gender: 'Male', age: '' });
        setRecordingsForReview([]);
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
        if (audioChunksRef.current.length === 0) return;
        
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
                    transcript: paragraphs[paragraphIndex].trim()
                };

                const audioDataUrl = await blobToDataURL(wavBlob);
                const newRecording: ReviewableRecording = {
                    metadata: newMetadata,
                    audioDataUrl: audioDataUrl,
                    status: 'pending'
                };
                
                setRecordingsForReview(prev => [...prev, newRecording]);
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
    }, [speakerInfo, paragraphIndex, t, handleStopRecording, paragraphs]);

    const handleLoadNextParagraph = useCallback(() => {
        if (paragraphs.length === 0 || !currentUserEmail) return;
    
        const nextIndex = paragraphIndex + 1;
    
        if (nextIndex >= paragraphs.length) {
            if (allParagraphsLoaded) {
                 if (paragraphs.length > 0) setParagraphIndex(0); // Loop back if all loaded and list is not empty
            }
            // else: wait for more paragraphs to load. The button should be disabled anyway.
        } else {
            setParagraphIndex(nextIndex);
        }
    
        // Pre-fetch next chunk if we're getting close to the end
        if (!isLoadingParagraphs && !allParagraphsLoaded && nextIndex >= paragraphs.length - 5) {
            loadParagraphs(currentUserEmail);
        }
    
        setMetadata(null);
        setAudioUrl(null);
        setMetadataUrl(null);
        setStatus({ message: '', type: 'info' });
    }, [paragraphIndex, paragraphs, allParagraphsLoaded, loadParagraphs, currentUserEmail, isLoadingParagraphs]);


    const handleReRecord = useCallback(() => {
        setMetadata(null);
        setAudioUrl(null);
        setMetadataUrl(null);
        setStatus({ message: 'statusReRecord', type: 'info' });
    }, []);

    const handleAcceptRecording = (id: string) => {
        setRecordingsForReview(prev => prev.map(rec => rec.metadata.id === id ? { ...rec, status: 'accepted' } : rec));
        setStatus({ message: 'recordingAccepted', type: 'success' });
    };

    const handleRejectRecording = (id: string) => {
        setRecordingsForReview(prev => prev.filter(rec => rec.metadata.id !== id));
        setRecordingsCount(prev => prev - 1);
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
    
    const pendingReviewCount = recordingsForReview.filter(r => r.status === 'pending').length;

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
                        <div className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                            {t('loggedInAs')} <span className="font-bold text-gray-800 dark:text-gray-200">{currentUserEmail}</span>
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
                        <button
                            onClick={() => setActiveTab('review')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg relative ${activeTab === 'review' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'}`}
                        >
                            {t('reviewTab')}
                            {pendingReviewCount > 0 && (
                                <span className="absolute top-3 -right-3 ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{pendingReviewCount}</span>
                            )}
                        </button>
                    </nav>
                </div>
                
                {activeTab === 'record' ? (
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
                            text={paragraphs[paragraphIndex] || '...'}
                        />

                        <Controls
                            isRecording={isRecording}
                            onStart={handleStartRecording}
                            onStop={handleStopRecording}
                            onNext={handleLoadNextParagraph}
                            disabled={isLoadingParagraphs || paragraphs.length === 0}
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
                ) : (
                    <ReviewTab
                        recordings={recordingsForReview}
                        onAccept={handleAcceptRecording}
                        onReject={handleRejectRecording}
                    />
                )}
            </div>
        </div>
    );
};

export default App;