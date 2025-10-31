// Helper function to write a string to a DataView
const writeString = (view: DataView, offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
    }
};

// Helper function to write PCM data
const writePCMData = (view: DataView, offset: number, audioData: Float32Array, bitDepth: number) => {
    let index = offset;
    const multiplier = Math.pow(2, bitDepth - 1) - 1;
    for (let i = 0; i < audioData.length; i++) {
        const sample = Math.max(-1, Math.min(1, audioData[i]));
        if (bitDepth === 16) {
            view.setInt16(index, sample * multiplier, true);
        } else if (bitDepth === 8) {
            view.setInt8(index, sample * multiplier);
        }
        index += (bitDepth / 8);
    }
};

// Function to encode AudioBuffer data into a WAV file format
const encodeWav = (audioBuffer: AudioBuffer, bitDepth: number): ArrayBuffer => {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const audioData = audioBuffer.getChannelData(0); // Forcing mono
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = audioData.length * bytesPerSample;
    
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');

    // "fmt " sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk1Size for PCM
    view.setUint16(20, 1, true); // AudioFormat 1 for PCM
    view.setUint16(22, 1, true); // numChannels forced to 1 (Mono)
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);

    // "data" sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // Write PCM data
    writePCMData(view, 44, audioData, bitDepth);

    return buffer;
};

// Function to convert a Blob to a WAV file with specific sample rate and bit depth
export const convertToWav = async (audioBlob: Blob, targetSampleRate: number, bitDepth: number): Promise<Blob> => {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const originalAudioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Create an OfflineAudioContext to resample
    const offlineContext = new OfflineAudioContext(
        1, // Forcing mono channel
        originalAudioBuffer.duration * targetSampleRate,
        targetSampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = originalAudioBuffer;
    source.connect(offlineContext.destination);
    source.start(0);

    const renderedBuffer = await offlineContext.startRendering();
    
    const wavData = encodeWav(renderedBuffer, bitDepth);
    return new Blob([wavData], { type: 'audio/wav' });
};

export const blobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.onabort = () => reject(new Error("Blob reading was aborted."));
        reader.readAsDataURL(blob);
    });
};
