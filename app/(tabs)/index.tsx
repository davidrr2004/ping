import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Sample event data
const events = [
  { id: '1', type: 'critical', title: 'Emergency Siren Detected', time: '2 mins ago', summary: 'Emergency vehicle siren detected nearby' },
  { id: '2', type: 'urgent', title: 'Train Announcement', time: '15 mins ago', summary: 'Platform change for the 3:30 departure' },
  { id: '3', type: 'info', title: 'Store Announcement', time: '45 mins ago', summary: 'Special offer in electronics department' },
  { id: '4', type: 'critical', title: 'Fire Alarm', time: '1 hour ago', summary: 'Building evacuation required' },
  { id: '5', type: 'info', title: 'Airport Announcement', time: '3 hours ago', summary: 'Gate change for Flight AC327' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  
  const getEventColor = (type) => {
    switch (type) {
      case 'critical': return '#FF3B30';
      case 'urgent': return '#FFCC00';
      case 'info': return '#8E8E93';
      default: return '#8E8E93';
    }
  };
  
  const getEventIcon = (type) => {
    switch (type) {
      case 'critical': return 'warning';
      case 'urgent': return 'alert-circle';
      case 'info': return 'information-circle';
      default: return 'information-circle';
    }
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.eventItem, { borderLeftColor: getEventColor(item.type) }]}
      onPress={() => navigation.navigate('EventDetail', { id: item.id })}
    >
      <View style={styles.eventHeader}>
        <Ionicons name={getEventIcon(item.type)} size={18} color={getEventColor(item.type)} />
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventTime}>{item.time}</Text>
      </View>
      <Text style={styles.eventSummary}>{item.summary}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Real-Time Event Log</Text>
        <Text style={styles.subtitle}>Your audio copilot is active</Text>
      </View>
      
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={item => item.id}
        style={styles.eventList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  eventList: {
    flex: 1,
  },
  eventItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  eventTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  eventSummary: {
    fontSize: 14,
    color: '#3C3C43',
  },
});