// src/services/recitationApi.js

import { transcribeAudio } from './whisperApi';
import { analyzeRecitation } from './gradingEngine';

/**
 * Complete recitation analysis pipeline using Gradio
 * @param {Blob} audioBlob - Recorded audio
 * @param {Object} ayah - Selected ayah object with expected text
 * @returns {Promise<Object>} Complete analysis result
 */
export const analyzeRecitationAudio = async (audioBlob, ayah) => {
  try {
    // Step 1: Transcribe using Gradio Whisper API
    const transcriptionResult = await transcribeAudio(audioBlob);
    
    if (!transcriptionResult.success) {
      throw new Error(transcriptionResult.error || 'Transcription failed');
    }
    
    // Step 2: Get expected text from ayah
    const expectedText = ayah.text || '';
    
    // Step 3: Grade the recitation using strict comparison
    const analysis = analyzeRecitation(
      transcriptionResult.transcription,
      expectedText
    );
    
    console.log('Recitation analysis result:', {
      transcription: transcriptionResult.transcription,
      expectedText: expectedText,
      matchPercentage: analysis.matchPercentage,
      points: analysis.points,
      score: analysis.score,
      errorsCount: analysis.errors.length,
    });
    
    return {
      success: true,
      ...analysis,
      transcription: transcriptionResult.transcription,
      rawApiResponse: transcriptionResult.rawResponse,
      duration: audioBlob.size / 16000, // Approximate duration in seconds
    };
  } catch (error) {
    console.error('Recitation analysis error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Direct prediction using Gradio client
 * @param {Blob} audioBlob - Audio blob
 * @param {string} endpoint - Endpoint name
 */
export const directPredict = async (audioBlob, endpoint = '/predict') => {
  try {
    const { Client } = await import('@gradio/client');
    const client = await Client.connect(import.meta.env.VITE_SPACE_URL || 'abaansohail131/QuranTranslator');
    const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
    
    const result = await client.predict(endpoint, {
      audio: audioFile,
    });
    
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error('Direct prediction error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get available endpoints from the Space
 */
export const getEndpoints = async () => {
  try {
    const { Client } = await import('@gradio/client');
    const client = await Client.connect(import.meta.env.VITE_SPACE_URL || 'abaansohail131/QuranTranslator');
    return client.config?.endpoints || [];
  } catch (error) {
    console.error('Error getting endpoints:', error);
    return [];
  }
};

/**
 * Test the connection with a sample audio
 */
export const testConnection = async () => {
  try {
    // Create a simple test audio blob (1 second of silence)
    const createTestAudio = () => {
      const sampleRate = 16000;
      const duration = 1;
      const samples = sampleRate * duration;
      
      // Create WAV file
      const buffer = new ArrayBuffer(44 + samples * 2);
      const view = new DataView(buffer);
      
      // WAV header
      const writeString = (offset, str) => {
        for (let i = 0; i < str.length; i++) {
          view.setUint8(offset + i, str.charCodeAt(i));
        }
      };
      
      writeString(0, 'RIFF');
      view.setUint32(4, 36 + samples * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, samples * 2, true);
      
      // Write silent audio data
      for (let i = 0; i < samples; i++) {
        view.setInt16(44 + i * 2, 0, true);
      }
      
      return new Blob([buffer], { type: 'audio/wav' });
    };
    
    const testAudio = createTestAudio();
    const result = await transcribeAudio(testAudio);
    
    return {
      success: result.success,
      message: result.success ? 'Connection successful' : 'Connection failed',
    };
  } catch (error) {
    console.error('Test connection error:', error);
    return {
      success: false,
      message: error.message,
    };
  }
};