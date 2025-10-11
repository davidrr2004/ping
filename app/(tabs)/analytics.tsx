import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Placeholder for charts - in a real app, you'd use a library like react-native-chart-kit
const Chart = ({ type, height }) => (
  <View style={[styles.chart, { height }]}>
    <Text style={styles.chartPlaceholder}>
      {type === 'bar' ? 'Bar Chart' : 'Line Chart'} Visualization
    </Text>
    <Text style={styles.chartNote}>
      (In a production app, this would be a real chart showing {type === 'bar' ? 'frequency data' : 'time-based data'})
    </Text>
  </View>
);

export default function AnalyticsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Activity</Text>
        <Chart type="line" height={200} />
        <Text style={styles.sectionDescription}>
          This chart shows when you typically encounter audio alerts throughout the day.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Frequency</Text>
        <Chart type="bar" height={180} />
        <Text style={styles.sectionDescription}>
          A breakdown of different alert types you've encountered this week.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recurring Sounds</Text>
        <View style={styles.recurringSoundItem}>
          <Ionicons name="train" size={24} color="#5856D6" style={styles.soundIcon} />
          <View style={styles.soundInfo}>
            <Text style={styles.soundTitle}>Train Station Announcements</Text>
            <Text style={styles.soundFrequency}>Weekdays, 8:00 AM - 9:00 AM</Text>
          </View>
        </View>
        
        <View style={styles.recurringSoundItem}>
          <Ionicons name="alarm" size={24} color="#FF3B30" style={styles.soundIcon} />
          <View style={styles.soundInfo}>
            <Text style={styles.soundTitle}>Alarm Clock</Text>
            <Text style={styles.soundFrequency}>Daily, 7:30 AM</Text>
          </View>
        </View>
        
        <View style={styles.recurringSoundItem}>
          <Ionicons name="notifications" size={24} color="#FFCC00" style={styles.soundIcon} />
          <View style={styles.soundInfo}>
            <Text style={styles.soundTitle}>Doorbell</Text>
            <Text style={styles.soundFrequency}>Weekends, Various times</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Predictive Intelligence</Text>
        <Text style={styles.predictionText}>
          Based on your patterns, we'll start preparing for train announcements on weekday mornings.
        </Text>
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
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 12,
  },
  chart: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholder: {
    fontSize: 16,
    fontWeight: '500',
  },
  chartNote: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
  },
  recurringSoundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  soundIcon: {
    marginRight: 16,
  },
  soundInfo: {
    flex: 1,
  },
  soundTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  soundFrequency: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  predictionText: {
    fontSize: 16,
    lineHeight: 22,
  },
});