import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
// Note: MediaPipe and ML Kit imports will be installed after package.json update

// Audio Analysis App Component
export default function App() {
  // Audio processing state
  const [isListening, setIsListening] = useState(false);
  const [statusText, setStatusText] = useState('Ready');
  const [soundClassification, setSoundClassification] = useState('No sounds detected');
  const [transcription, setTranscription] = useState('No speech detected');
  const [urgencyAnalysis, setUrgencyAnalysis] = useState('Normal');
  
  // Translation state
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [translationStatus, setTranslationStatus] = useState('Ready');
  
  // Audio recording and processing refs
  const recordingRef = useRef(null);
  const audioProcessorRef = useRef(null);
  const vadModelRef = useRef(null);
  const yamnetModelRef = useRef(null);
  const urgencyModelRef = useRef(null);
  
  // Initialize TensorFlow Lite models
  useEffect(() => {
    initializeModels();
    setupAudioPermissions();
  }, []);

  const setupAudioPermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Audio recording permission is required for this app to work.');
      }
    } catch (error) {
      console.log('Permission setup error:', error);
    }
  };

  const initializeModels = async () => {
    try {
      setStatusText('Loading AI models...');
      
      // Note: In a real implementation, you would need to bundle the .tflite model files
      // with your app and load them from the local filesystem using MediaPipe
      // For now, we'll simulate the model loading
      
      // Simulate model loading delays
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatusText('Models loaded successfully');
      
      // Initialize translation language packs
      await initializeTranslation();
      
    } catch (error) {
      console.log('Model initialization error:', error);
      setStatusText('Failed to load models');
      Alert.alert('Initialization Error', 'Failed to load AI models. Some features may not work.');
    }
  };

  const initializeTranslation = async () => {
    try {
      // Check if language packs are available
      // This would typically involve downloading Spanish language pack
      setTranslationStatus('Checking language packs...');
      
      // Simulate language pack check/download
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTranslationStatus('Translation ready');
    } catch (error) {
      console.log('Translation initialization error:', error);
      setTranslationStatus('Translation unavailable');
    }
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      setStatusText('Starting audio capture...');
      
      // Configure audio recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });

      recordingRef.current = recording;
      setStatusText('Listening...');
      
      // Start continuous audio processing
      startAudioProcessing();
      
    } catch (error) {
      console.log('Start listening error:', error);
      setStatusText('Failed to start listening');
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      setIsListening(false);
      setStatusText('Stopping...');
      
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
      }
      
      // Stop audio processing
      stopAudioProcessing();
      
      setStatusText('Ready');
      setSoundClassification('No sounds detected');
      setTranscription('No speech detected');
      setUrgencyAnalysis('Normal');
      
    } catch (error) {
      console.log('Stop listening error:', error);
      setStatusText('Error stopping');
    }
  };

  const startAudioProcessing = () => {
    // Simulate continuous audio processing
    audioProcessorRef.current = setInterval(() => {
      if (isListening) {
        processAudioChunk();
      }
    }, 1000); // Process every second
  };

  const stopAudioProcessing = () => {
    if (audioProcessorRef.current) {
      clearInterval(audioProcessorRef.current);
      audioProcessorRef.current = null;
    }
  };

  const processAudioChunk = async () => {
    try {
      // Simulate VAD (Voice Activity Detection)
      const speechDetected = Math.random() > 0.7; // 30% chance of speech
      
      if (speechDetected) {
        setStatusText('Speech detected - processing...');
        
        // Simulate processing pipeline:
        // 1. Noise suppression
        // 2. Speech recognition (Whisper)
        // 3. Urgency analysis
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Simulate Whisper transcription
        const mockTranscriptions = [
          'Hello, how are you today?',
          'The weather is nice outside.',
          'I need help with something.',
          'Emergency! Call for assistance!',
          'Thank you for your help.',
        ];
        const transcriptionResult = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
        setTranscription(transcriptionResult);
        
        // Simulate urgency analysis
        const urgencyLevels = ['Low', 'Normal', 'High', 'Critical'];
        const urgencyResult = transcriptionResult.toLowerCase().includes('emergency') ? 'Critical' : 
                             urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)];
        setUrgencyAnalysis(urgencyResult);
        
        setStatusText('Listening...');
      }
      
      // Simulate YAMNet continuous sound classification
      const mockSounds = [
        'Background noise',
        'Human speech',
        'Music',
        'Traffic sounds',
        'Birds chirping',
        'Door closing',
        'Phone ringing',
      ];
      const soundResult = mockSounds[Math.floor(Math.random() * mockSounds.length)];
      setSoundClassification(soundResult);
      
    } catch (error) {
      console.log('Audio processing error:', error);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Input Required', 'Please enter text to translate.');
      return;
    }
    
    try {
      setTranslationStatus('Translating...');
      
      // Simulate ML Kit translation (real implementation would use @react-native-ml-kit/translate-text)
      // For now, provide mock translation
      const mockTranslations = {
        'hello': 'hola',
        'goodbye': 'adiós',
        'thank you': 'gracias',
        'how are you': 'cómo estás',
        'good morning': 'buenos días',
        'emergency': 'emergencia',
        'help': 'ayuda',
      };
      
      const lowerInput = inputText.toLowerCase();
      let result = mockTranslations[lowerInput] || `[Spanish translation of: ${inputText}]`;
      
      setTranslatedText(result);
      setTranslationStatus('Translation complete');
      
    } catch (error) {
      console.log('Translation error:', error);
      setTranslationStatus('Translation failed');
      Alert.alert('Translation Error', 'Failed to translate text. Please check your connection and try again.');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Audio Analysis Tool</Text>
      </View>
      
      {/* Audio Processing Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Audio Processing</Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title={isListening ? "Stop Listening" : "Start Listening"}
            onPress={toggleListening}
            color={isListening ? "#f44336" : "#4CAF50"}
          />
        </View>
        
        <View style={styles.outputContainer}>
          <View style={styles.outputItem}>
            <Text style={styles.outputLabel}>Sound Classification:</Text>
            <Text style={styles.outputText}>{soundClassification}</Text>
          </View>
          
          <View style={styles.outputItem}>
            <Text style={styles.outputLabel}>Transcription:</Text>
            <Text style={styles.outputText}>{transcription}</Text>
          </View>
          
          <View style={styles.outputItem}>
            <Text style={styles.outputLabel}>Urgency Analysis:</Text>
            <Text style={[
              styles.outputText,
              { color: urgencyAnalysis === 'Critical' ? '#f44336' : 
                       urgencyAnalysis === 'High' ? '#ff9800' : '#4CAF50' }
            ]}>
              {urgencyAnalysis}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Translation Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Translation</Text>
        
        <View style={styles.translationContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter text to translate to Spanish..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          
          <View style={styles.buttonContainer}>
            <Button
              title="Translate"
              onPress={handleTranslate}
              color="#2196F3"
            />
          </View>
          
          <View style={styles.translationStatus}>
            <Text style={styles.statusText}>{translationStatus}</Text>
          </View>
          
          {translatedText ? (
            <View style={styles.translationResult}>
              <Text style={styles.outputLabel}>Spanish Translation:</Text>
              <Text style={styles.outputText}>{translatedText}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginVertical: 16,
  },
  outputContainer: {
    marginTop: 16,
  },
  outputItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  outputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  outputText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  translationContainer: {
    marginTop: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: 'white',
  },
  translationStatus: {
    alignItems: 'center',
    marginVertical: 8,
  },
  translationResult: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
});