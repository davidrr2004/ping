import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  };
  
  return (
    <View style={styles.container}>
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/300' }} 
            style={styles.image} 
          />
          <Text style={styles.title}>Welcome to Ping</Text>
          <Text style={styles.subtitle}>
            An intelligent co-pilot for your ears that ensures you never miss what matters.
          </Text>
          
          <View style={styles.permissionContainer}>
            <Ionicons name="mic" size={24} color="#007AFF" />
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>Microphone Access</Text>
              <Text style={styles.permissionDescription}>
                Required for continuous audio capture and analysis
              </Text>
            </View>
          </View>
          
          <View style={styles.permissionContainer}>
            <Ionicons name="notifications" size={24} color="#007AFF" />
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>Notifications</Text>
              <Text style={styles.permissionDescription}>
                For delivering visual and haptic alerts
              </Text>
            </View>
          </View>
          
          <View style={styles.permissionContainer}>
            <Ionicons name="location" size={24} color="#007AFF" />
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>Location Access</Text>
              <Text style={styles.permissionDescription}>
                For geofencing and predictive alerts
              </Text>
            </View>
          </View>
        </View>
      )}
      
      {step === 2 && (
        <View style={styles.stepContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/300' }} 
            style={styles.image} 
          />
          <Text style={styles.title}>Set Up Your Languages</Text>
          <Text style={styles.subtitle}>
            Select your native language and download language packs for offline translation.
          </Text>
          
          <TouchableOpacity style={styles.languageOption}>
            <Text style={styles.languageText}>English (Native)</Text>
            <Ionicons name="checkmark-circle" size={24} color="#34C759" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.languageOption}>
            <Text style={styles.languageText}>Spanish</Text>
            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.languageOption}>
            <Text style={styles.languageText}>French</Text>
            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.languageOption}>
            <Text style={styles.languageText}>Chinese</Text>
            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.seeMoreButton}>
            <Text style={styles.seeMoreText}>See More Languages</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {step === 3 && (
        <View style={styles.stepContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/300' }} 
            style={styles.image} 
          />
          <Text style={styles.title}>Choose Your Alerts</Text>
          <Text style={styles.subtitle}>
            Select which types of sounds and announcements you want to be alerted about.
          </Text>
          
          <View style={styles.alertOption}>
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>Sirens & Alarms</Text>
              <Text style={styles.alertDescription}>Emergency vehicles, fire alarms</Text>
            </View>
            <TouchableOpacity style={styles.switchOn}>
              <View style={styles.switchThumb} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.alertOption}>
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>Public Transport</Text>
              <Text style={styles.alertDescription}>Train, bus, airport announcements</Text>
            </View>
            <TouchableOpacity style={styles.switchOn}>
              <View style={styles.switchThumb} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.alertOption}>
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>Doorbells & Knocks</Text>
              <Text style={styles.alertDescription}>Someone at your door</Text>
            </View>
            <TouchableOpacity style={styles.switchOn}>
              <View style={styles.switchThumb} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.alertOption}>
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>Store Announcements</Text>
              <Text style={styles.alertDescription}>In-store promotions and messages</Text>
            </View>
            <TouchableOpacity style={styles.switchOff}>
              <View style={styles.switchThumbOff} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <View style={styles.footer}>
        <View style={styles.pagination}>
          <View style={[styles.paginationDot, step === 1 && styles.activeDot]} />
          <View style={[styles.paginationDot, step === 2 && styles.activeDot]} />
          <View style={[styles.paginationDot, step === 3 && styles.activeDot]} />
        </View>
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>{step === 3 ? 'Get Started' : 'Next'}</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  stepContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666666',
    lineHeight: 24,
  },
  permissionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  permissionText: {
    marginLeft: 16,
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  permissionDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    marginBottom: 12,
    width: '100%',
  },
  languageText: {
    fontSize: 16,
  },
  downloadText: {
    color: '#007AFF',
    fontSize: 14,
  },
  seeMoreButton: {
    marginTop: 8,
  },
  seeMoreText: {
    color: '#007AFF',
    fontSize: 16,
  },
  alertOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    marginBottom: 12,
    width: '100%',
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  alertDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  switchOn: {
    width: 50,
    height: 30,
    backgroundColor: '#34C759',
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchOff: {
    width: 50,
    height: 30,
    backgroundColor: '#D1D1D6',
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 2,
    alignItems: 'flex-start',
  },
  switchThumb: {
    width: 26,
    height: 26,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    alignSelf: 'flex-end',
  },
  switchThumbOff: {
    width: 26,
    height: 26,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
  },
  footer: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D1D6',
    marginRight: 8,
  },
  activeDot: {
    backgroundColor: '#007AFF',
    width: 16,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});