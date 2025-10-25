
export interface SpeakerInfo {
    id: string;
    placeOfBirth: string;
    gender: 'Male' | 'Female' | 'Other';
    age: string; // Keep as string for form input, parse to number on submission
}

export interface AudioInfo {
    fileName: string;
    sampleRate: number;
    bitDepth: number;
    channels: string;
    durationSeconds: number | null;
}

export interface RecordingMetadata {
    id: string;
    speaker: {
        id: string;
        place_of_birth: string;
        gender: 'Male' | 'Female' | 'Other';
        age: number;
    };
    audio: AudioInfo;
    transcript: string;
}

export interface ReviewableRecording {
    metadata: RecordingMetadata;
    audioDataUrl: string;
    status: 'pending' | 'accepted';
}
