import { AlertEvent } from './DatabaseService';
import { Platform } from 'react-native';
import Translate, { TranslateLanguage } from '@react-native-ml-kit/translate-text';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';

export class AIPipeline {
  private isProcessing = false;
  private isTfReady = false;
  private yamnetModel: tf.GraphModel | null = null;

  async init() {
    try {
      await tf.ready();
      this.isTfReady = true;
      console.log('TFJS ready');
      // In a real scenario, you'd load the model here:
      // const modelJson = require('../assets/models/yamnet.json');
      // const modelWeights = require('../assets/models/yamnet_weights.bin');
      // this.yamnetModel = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
    } catch (e) {
      console.error("TF init failed", e);
    }
  }

  async processAudioChunk(audioUri: string): Promise<AlertEvent | null> {
    if (this.isProcessing) return null;
    this.isProcessing = true;

    try {
      // 1. Noise Suppression
      // Real implementation would pass audioUri to a TFLite model
      const cleanAudio = await this.noiseSuppression(audioUri);

      // 2a. Alert Detection & 2b. Speech Detection
      // Real implementation would decode audio buffer and run through yamnetModel/VAD
      const eventType = this.detectEvent(cleanAudio);
      if (!eventType) {
        this.isProcessing = false;
        return null; // Nothing detected
      }

      // 3. Transcription & Translation
      let transcription = "";
      let translation = "";
      let urgency: 'Informational' | 'Urgent' | 'Critical' = 'Informational';

      if (eventType === 'Speech') {
        transcription = await this.transcribe(cleanAudio);
        translation = await this.translate(transcription);
        urgency = this.analyzeUrgency(transcription, eventType);
      } else {
        transcription = "Siren/Alarm Sound Detected";
        translation = await this.translate(transcription);
        urgency = 'Critical';
      }

      const alert: AlertEvent = {
        timestamp: new Date().toISOString(),
        eventType,
        transcription,
        translation,
        urgency,
        location: "Unknown",
        confidence: 0.95
      };

      this.isProcessing = false;
      return alert;
    } catch (e) {
      console.error("AI Pipeline error:", e);
      this.isProcessing = false;
      return null;
    }
  }

  private async noiseSuppression(uri: string): Promise<string> {
    return uri; // Mocked
  }

  private detectEvent(uri: string): 'Speech' | 'Alert' | null {
    // Mocking real inference since we don't have the audio decoding/TFLite models configured natively in this repo
    const random = Math.random();
    if (random > 0.8) return 'Alert';
    if (random > 0.5) return 'Speech';
    return null;
  }

  private async transcribe(uri: string): Promise<string> {
    const mockTranscriptions = [
      'The next train to Central Station is arriving at platform 2.',
      'Attention all passengers, please proceed to gate 5.',
      'Emergency! Please evacuate the building immediately.',
      'Just calling to see if you want to get lunch later.'
    ];
    return mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
  }

  private async translate(text: string): Promise<string> {
    try {
      // Use ML Kit to translate to Spanish locally
      const result = await Translate.translate({
        text: text,
        sourceLanguage: TranslateLanguage.ENGLISH,
        targetLanguage: TranslateLanguage.SPANISH,
        downloadModelIfNeeded: true
      });
      return result as unknown as string;
    } catch (e) {
      console.error("Translation failed", e);
      return text;
    }
  }

  private analyzeUrgency(text: string, type: 'Speech' | 'Alert'): 'Informational' | 'Urgent' | 'Critical' {
    if (type === 'Alert' || text.toLowerCase().includes('emergency') || text.toLowerCase().includes('evacuate')) {
      return 'Critical';
    }
    if (text.toLowerCase().includes('attention') || text.toLowerCase().includes('arriving')) {
      return 'Urgent';
    }
    return 'Informational';
  }
}

export const aiPipeline = new AIPipeline();
