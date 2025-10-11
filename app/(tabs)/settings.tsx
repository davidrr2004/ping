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
  
  const toggleSetting = (setting) => {
    setAlertSettings({
      ...alertSettings,
      [setting]: !alertSettings[setting]
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Categories</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Sirens & Alarms</Text>
          <Switch
            value={alertSettings.sirens}
            onValueChange={() => toggleSetting('sirens')}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Public Transport</Text>
          <Switch
            value={alertSettings.publicTransport}
            onValueChange={() => toggleSetting('publicTransport')}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Store Announcements</Text>
          <Switch
            value={alertSettings.storeAnnouncements}
            onValueChange={() => toggleSetting('storeAnnouncements')}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Doorbell</Text>
          <Switch
            value={alertSettings.doorbell}
            onValueChange={() => toggleSetting('doorbell')}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Phone Ringing</Text>
          <Switch
            value={alertSettings.phoneRinging}
            onValueChange={() => toggleSetting('phoneRinging')}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Alarms</Text>
          <Switch
            value={alertSettings.alarms}
            onValueChange={() => toggleSetting('alarms')}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Quiet Hours</Text>
          <Switch
            value={quietHours}
            onValueChange={() => setQuietHours(!quietHours)}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
          />
        </View>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Set Quiet Hours Schedule</Text>
          <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Haptic Patterns</Text>
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
  },
});