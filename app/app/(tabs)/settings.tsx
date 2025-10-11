import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [alertSettings, setAlertSettings] = useState({
    sirens: true,
    publicTransport: true,
    storeAnnouncements: false,
    doorbell: true,
    phoneRinging: true,
    alarms: true,
  });
  
  const [quietHours, setQuietHours] = useState(false);
  
  // New accessibility settings
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    vibrationHaptics: true,
    flashlightNotification: false,
    increasedVolume: true,
    visualIndicators: false,
    reduceMotion: false,
  });
  
  const toggleSetting = (setting) => {
    setAlertSettings({
      ...alertSettings,
      [setting]: !alertSettings[setting]
    });
  };
  
  // Toggle accessibility settings
  const toggleAccessibilitySetting = (setting) => {
    setAccessibilitySettings({
      ...accessibilitySettings,
      [setting]: !accessibilitySettings[setting]
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Categories</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Text style={styles.settingLabel}>Sirens & Alarms</Text>
            <Text style={styles.settingDescription}>Emergency vehicles and alerts</Text>
          </View>
          <Switch
            value={alertSettings.sirens}
            onValueChange={() => toggleSetting('sirens')}
            trackColor={{ false: '#D1D1D6', true: '#FF7D3B' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Text style={styles.settingLabel}>Public Transport</Text>
            <Text style={styles.settingDescription}>Train and bus announcements</Text>
          </View>
          <Switch
            value={alertSettings.publicTransport}
            onValueChange={() => toggleSetting('publicTransport')}
            trackColor={{ false: '#D1D1D6', true: '#FF7D3B' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Text style={styles.settingLabel}>Store Announcements</Text>
            <Text style={styles.settingDescription}>In-store deals and information</Text>
          </View>
          <Switch
            value={alertSettings.storeAnnouncements}
            onValueChange={() => toggleSetting('storeAnnouncements')}
            trackColor={{ false: '#D1D1D6', true: '#FF7D3B' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Text style={styles.settingLabel}>Doorbell</Text>
            <Text style={styles.settingDescription}>Home doorbell detection</Text>
          </View>
          <Switch
            value={alertSettings.doorbell}
            onValueChange={() => toggleSetting('doorbell')}
            trackColor={{ false: '#D1D1D6', true: '#FF7D3B' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Text style={styles.settingLabel}>Phone Ringing</Text>
            <Text style={styles.settingDescription}>Detect when your phone is ringing</Text>
          </View>
          <Switch
            value={alertSettings.phoneRinging}
            onValueChange={() => toggleSetting('phoneRinging')}
            trackColor={{ false: '#D1D1D6', true: '#FF7D3B' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Text style={styles.settingLabel}>Alarms</Text>
            <Text style={styles.settingDescription}>Clock and security alarm detection</Text>
          </View>
          <Switch
            value={alertSettings.alarms}
            onValueChange={() => toggleSetting('alarms')}
            trackColor={{ false: '#D1D1D6', true: '#FF7D3B' }}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Text style={styles.settingLabel}>Quiet Hours</Text>
            <Text style={styles.settingDescription}>Silence non-critical alerts during set hours</Text>
          </View>
          <Switch
            value={quietHours}
            onValueChange={() => setQuietHours(!quietHours)}
            trackColor={{ false: '#D1D1D6', true: '#FF7D3B' }}
          />
        </View>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Text style={styles.settingLabel}>Set Quiet Hours Schedule</Text>
            <Text style={styles.settingDescription}>Configure when quiet hours are active</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Text style={styles.settingLabel}>Notification Sounds</Text>
            <Text style={styles.settingDescription}>Customize alert sounds by category</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accessibility</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Text style={styles.settingLabel}>Vibration Haptics</Text>
            <Text style={styles.settingDescription}>Vibrate when notifications are received</Text>
          </View>
          <Switch
            value={accessibilitySettings.vibrationHaptics}
            onValueChange={() => toggleAccessibilitySetting('vibrationHaptics')}
            trackColor={{ false: '#D1D1D6', true: '#FF7D3B' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Text style={styles.settingLabel}>Flashlight Notifications</Text>
            <Text style={styles.settingDescription}>Flash light for critical notifications</Text>
          </View>
          <Switch
            value={accessibilitySettings.flashlightNotification}
            onValueChange={() => toggleAccessibilitySetting('flashlightNotification')}
            trackColor={{ false: '#D1D1D6', true: '#FF7D3B' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Text style={styles.settingLabel}>Increased Volume</Text>
            <Text style={styles.settingDescription}>Play notifications at higher volume</Text>
          </View>
          <Switch
            value={accessibilitySettings.increasedVolume}
            onValueChange={() => toggleAccessibilitySetting('increasedVolume')}
            trackColor={{ false: '#D1D1D6', true: '#FF7D3B' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Text style={styles.settingLabel}>Visual Indicators</Text>
            <Text style={styles.settingDescription}>Show on-screen alerts with color coding</Text>
          </View>
          <Switch
            value={accessibilitySettings.visualIndicators}
            onValueChange={() => toggleAccessibilitySetting('visualIndicators')}
            trackColor={{ false: '#D1D1D6', true: '#FF7D3B' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Text style={styles.settingLabel}>Reduce Motion</Text>
            <Text style={styles.settingDescription}>Minimize animations in the app</Text>
          </View>
          <Switch
            value={accessibilitySettings.reduceMotion}
            onValueChange={() => toggleAccessibilitySetting('reduceMotion')}
            trackColor={{ false: '#D1D1D6', true: '#FF7D3B' }}
          />
        </View>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Haptic Intensity</Text>
          <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Model & Languages</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Model Sensitivity</Text>
          <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Language Management</Text>
          <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    backgroundColor: '#F2F2F7',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  // New styles for accessibility settings
  settingLabelContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  settingDescription: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
});