// src/services/ttsApi.js

import { Client } from "@gradio/client";

const TTS_SPACE_URL = import.meta.env.VITE_TTS_SPACE_URL || 'abaansohail131/qirah-tts';

let clientInstance = null;

/**
 * Initialize and get Gradio client instance for TTS
 */
const getTTSClient = async () => {
  if (!clientInstance) {
    try {
      clientInstance = await Client.connect(TTS_SPACE_URL);
      console.log('TTS Client connected successfully');
    } catch (error) {
      console.error('Failed to connect to TTS Space:', error);
      throw error;
    }
  }
  return clientInstance;
};

/**
 * Generate speech from text using TTS API
 * @param {string} text - Arabic text to synthesize (without diacritics)
 * @param {number} speakerIdx - Speaker voice index (default: 105)
 * @returns {Promise<{success: boolean, audioUrl: string, error?: string}>}
 */
export const synthesizeSpeech = async (text, speakerIdx = 105) => {
  try {
    const client = await getTTSClient();
    
    console.log('Synthesizing speech for text:', { text, speakerIdx });
    
    const result = await client.predict("/synthesize", {
      text: text,
      speaker_idx: speakerIdx,
    });
    
    console.log('TTS Response:', result);
    
    // Extract audio data from result
    let audioUrl = null;
    if (result.data && result.data.length > 0) {
      // Gradio returns audio as a file URL or blob
      const audioData = result.data[0];
      if (typeof audioData === 'string') {
        audioUrl = audioData;
      } else if (audioData && audioData.url) {
        audioUrl = audioData.url;
      } else if (audioData && audioData instanceof Blob) {
        audioUrl = URL.createObjectURL(audioData);
      }
    } else if (result.audio) {
      audioUrl = result.audio;
    } else if (result.url) {
      audioUrl = result.url;
    }
    
    return {
      success: true,
      audioUrl: audioUrl,
      rawResponse: result,
    };
  } catch (error) {
    console.error('TTS API error:', error);
    return {
      success: false,
      audioUrl: null,
      error: error.message,
    };
  }
};

/**
 * Get available speaker voices
 */
export const getSpeakerVoices = async () => {
  try {
    const client = await getTTSClient();
    // If the API provides a way to get available speakers, add it here
    // For now, return default range
    return Array.from({ length: 150 }, (_, i) => i + 1);
  } catch (error) {
    console.error('Error getting speaker voices:', error);
    return [];
  }
};

export const resetTTSClient = () => {
  clientInstance = null;
};