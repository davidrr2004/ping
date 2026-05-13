import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
  Animated,
  Easing
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import { audioCaptureService } from './services/AudioCaptureService';
import { aiPipeline } from './services/AIPipeline';
import { initDB, insertAlert, getAlerts, AlertEvent } from './services/DatabaseService';
import { sendNotification, requestNotificationPermissions } from './services/NotificationService';
import { checkPredictiveAlerts, recordEventForPattern } from './services/PredictiveAlerts';

// Audio Analysis App Component
export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [statusText, setStatusText] = useState('Ready');
  const [currentAlert, setCurrentAlert] = useState<AlertEvent | null>(null);

  // Animation values for UI alerts
  const [fadeAnim] = useState(new Animated.Value(0));
  const [flashAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    setupServices();
  }, []);

  useEffect(() => {
    // Check predictive alerts periodically
    const interval = setInterval(() => {
      checkPredictiveAlerts();
    }, 60000); // every minute
    return () => clearInterval(interval);
  }, []);

  const setupServices = async () => {
    try {
      await initDB();
      await aiPipeline.init();

      const audioGranted = await audioCaptureService.requestPermissions();
      const notifGranted = await requestNotificationPermissions();

      if (!audioGranted) {
        Alert.alert('Permission Required', 'Audio recording permission is required for this app to work.');
      }
      
      await checkPredictiveAlerts();
    } catch (error) {
      console.log('Service setup error:', error);
    }
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      setStatusText('Starting continuous audio capture...');
      
      // Use continuous capture with double buffering
      await audioCaptureService.startContinuousRecording(async (uri) => {
        setStatusText('Processing chunk...');
        await processAudioChunk(uri);
      }, 3000); // chunk duration 3s
      
      setStatusText('Listening (Continuous)...');
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
      
      await audioCaptureService.stopRecording();
      
      setStatusText('Ready');
    } catch (error) {
      console.log('Stop listening error:', error);
      setStatusText('Error stopping');
    }
  };

  const processAudioChunk = async (uri: string) => {
    try {
      const alertEvent = await aiPipeline.processAudioChunk(uri);
      
      if (alertEvent) {
        setCurrentAlert(alertEvent);

        // Notify user and provide haptics based on urgency
        await sendNotification("Detected Event", alertEvent.transcription, alertEvent.urgency);
        
        // Try getting location to save for pattern
        let locString = "Unknown";
        try {
           let { coords } = await Location.getCurrentPositionAsync({});
           await recordEventForPattern(alertEvent, coords);
           locString = `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`;
        } catch(e) {}
        
        // Save to offline DB
        await insertAlert({...alertEvent, location: locString});
        
        triggerVisualAlert(alertEvent.urgency);
      }
    } catch (error) {
      console.log('Audio processing error:', error);
    }
  };

  const triggerVisualAlert = (urgency: 'Informational' | 'Urgent' | 'Critical') => {
    fadeAnim.setValue(1);
    
    if (urgency === 'Critical') {
      // Start flashing
      Animated.loop(
        Animated.sequence([
          Animated.timing(flashAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
          Animated.timing(flashAnim, { toValue: 0, duration: 200, useNativeDriver: false })
        ]),
        { iterations: 10 }
      ).start();
    } else {
      flashAnim.setValue(0);
    }

    // Auto dismiss after a few seconds
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }).start(() => setCurrentAlert(null));
    }, urgency === 'Critical' ? 5000 : 3000);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // UI Render functions
  const renderAlertBanner = () => {
    if (!currentAlert) return null;

    let bgColor = '#2196F3'; // Info
    let textColor = '#fff';

    if (currentAlert.urgency === 'Urgent') {
      bgColor = '#FFC107'; // Yellow
      textColor = '#000';
    } else if (currentAlert.urgency === 'Critical') {
      bgColor = '#F44336'; // Red
      textColor = '#fff';
    }

    const flashColor = flashAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [bgColor, '#000000']
    });

    const getAdditionalStyle = () => {
      if (currentAlert.urgency === 'Critical') {
        return styles.criticalBanner;
      }
      if (currentAlert.urgency === 'Informational') {
        return styles.informationalBadge;
      }
      return {};
    };

    return (
      <Animated.View style={[
        styles.alertBanner,
        getAdditionalStyle(),
        {
           opacity: fadeAnim,
           backgroundColor: currentAlert.urgency === 'Critical' ? flashColor : bgColor
        }
      ]}>
        <Text style={[styles.alertTitle, {color: textColor, textAlign: currentAlert.urgency === 'Critical' ? 'center' : 'left'}]}>
          {currentAlert.urgency.toUpperCase()} - {currentAlert.eventType}
        </Text>
        <Text style={[styles.alertText, {color: textColor, textAlign: currentAlert.urgency === 'Critical' ? 'center' : 'left'}]}>{currentAlert.transcription}</Text>
        <Text style={[styles.alertSubText, {color: textColor, textAlign: currentAlert.urgency === 'Critical' ? 'center' : 'left'}]}>{currentAlert.translation}</Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      
      {renderAlertBanner()}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Audio Analysis Tool</Text>
      </View>
      
      {/* Audio Processing Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Continuous Capturing</Text>
        
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
  alertBanner: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    padding: 15,
    borderRadius: 8,
    zIndex: 100,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  criticalBanner: {
    // "Full-screen" simulation
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  informationalBadge: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    top: 50,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  alertText: {
    fontSize: 18,
    marginBottom: 5,
  },
  alertSubText: {
    fontSize: 16,
    fontStyle: 'italic',
  }
});
