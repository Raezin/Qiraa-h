// src/services/whisperApi.js

import { Client } from '@gradio/client';

// Your Hugging Face Space URL
const SPACE_URL = import.meta.env.VITE_SPACE_URL || 'abaansohail131/QuranTranslator';

let clientInstance = null;

/**
 * Initialize and get Gradio client instance
 */
const getClient = async () => {
  if (!clientInstance) {
    try {
      clientInstance = await Client.connect(SPACE_URL);
      console.log('Gradio client connected successfully');
    } catch (error) {
      console.error('Failed to connect to Gradio Space:', error);
      throw error;
    }
  }
  return clientInstance;
};

/**
 * Send audio file to Whisper API for transcription using Gradio client
 * @param {Blob} audioBlob - The audio blob to transcribe
 * @returns {Promise<{success: boolean, transcription: string, error?: string}>}
 */
export const transcribeAudio = async (audioBlob) => {
  try {
    const client = await getClient();
    
    // Create a File object from the blob
    const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
    
    // Call the predict endpoint
    const result = await client.predict("/predict", {
      audio: audioFile,
    });
    
    // Extract transcription from result (Gradio returns data array)
    let transcription = '';
    if (result.data && result.data.length > 0) {
      transcription = result.data[0];
    } else if (typeof result === 'string') {
      transcription = result;
    } else if (result.text) {
      transcription = result.text;
    }
    
    console.log('Whisper API response:', { transcription, rawResult: result });
    
    return {
      success: true,
      transcription: transcription,
      rawResponse: result,
    };
  } catch (error) {
    console.error('Whisper API error:', error);
    return {
      success: false,
      transcription: '',
      error: error.message,
    };
  }
};

/**
 * Check if Gradio Space is accessible
 */
export const checkWhisperApiHealth = async () => {
  try {
    const client = await getClient();
    return client !== null;
  } catch (error) {
    console.error('Whisper API health check failed:', error);
    return false;
  }
};

/**
 * Reset client instance (useful for reconnection)
 */
export const resetClient = () => {
  clientInstance = null;
};