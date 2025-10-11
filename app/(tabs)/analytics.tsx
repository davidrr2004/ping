import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for charts
const weeklyData = [
  { day: 'Mon', count: 12, color: '#FF7D3B' },
  { day: 'Tue', count: 18, color: '#FF7D3B' },
  { day: 'Wed', count: 14, color: '#FF7D3B' },
  { day: 'Thu', count: 9, color: '#FF7D3B' },
  { day: 'Fri', count: 16, color: '#FF7D3B' },
  { day: 'Sat', count: 7, color: '#FF7D3B' },
  { day: 'Sun', count: 5, color: '#FF7D3B' },
];

const categoryData = [
  { name: 'Sirens', count: 7, color: '#FF3B30' },
  { name: 'Transit', count: 22, color: '#FFCC00' },
  { name: 'Doorbell', count: 14, color: '#5856D6' },
  { name: 'Alerts', count: 9, color: '#FF9500' },
  { name: 'Other', count: 19, color: '#8E8E93' },
];

// Simple Bar Chart implementation
const BarChart = ({ data, height, maxValue, horizontal = false }) => {
  const screenWidth = Dimensions.get('window').width - 64; // Account for padding
  const barWidth = horizontal ? 20 : (screenWidth / data.length) - 10;
  
  // Calculate max value for scaling if not provided
  const calculatedMax = maxValue || Math.max(...data.map(item => item.count)) * 1.2;
  
  return (
    <View style={[styles.chartContainer, { height }]}>
      <View style={styles.chartLabels}>
        {data.map((item, index) => (
          <Text key={index} style={styles.chartLabel}>
            {horizontal ? item.count : item.day || item.name}
          </Text>
        ))}
      </View>
      <View style={styles.chartBars}>
        {data.map((item, index) => (
          <View key={index} style={styles.barWrapper}>
            {horizontal ? (
              <View 
                style={[
                  styles.horizontalBar, 
                  { 
                    width: (item.count / calculatedMax) * (screenWidth - 50),
                    backgroundColor: item.color
                  }
                ]} 
              />
            ) : (
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: (item.count / calculatedMax) * (height - 50),
                    width: barWidth,
                    backgroundColor: item.color
                  }
                ]} 
              />
            )}
          </View>
        ))}
      </View>
      {horizontal && (
        <View style={styles.horizontalLabels}>
          {data.map((item, index) => (
            <Text key={index} style={styles.horizontalLabel}>
              {item.name}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default function AnalyticsScreen() {
  const [timeFrame, setTimeFrame] = useState('week'); // 'day', 'week', 'month'
  const [insightTab, setInsightTab] = useState('trends'); // 'trends', 'sounds', 'predictions'
  
  return (
    <ScrollView style={styles.container}>
      {/* Time Frame Selector */}
      <View style={styles.timeSelector}>
        <TouchableOpacity 
          style={[styles.timeButton, timeFrame === 'day' && styles.timeButtonActive]}
          onPress={() => setTimeFrame('day')}
        >
          <Text style={[styles.timeButtonText, timeFrame === 'day' && styles.timeButtonTextActive]}>
            Day
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.timeButton, timeFrame === 'week' && styles.timeButtonActive]}
          onPress={() => setTimeFrame('week')}
        >
          <Text style={[styles.timeButtonText, timeFrame === 'week' && styles.timeButtonTextActive]}>
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.timeButton, timeFrame === 'month' && styles.timeButtonActive]}
          onPress={() => setTimeFrame('month')}
        >
          <Text style={[styles.timeButtonText, timeFrame === 'month' && styles.timeButtonTextActive]}>
            Month
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Summary Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>73</Text>
          <Text style={styles.statLabel}>Total Events</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>7</Text>
          <Text style={styles.statLabel}>Critical Alerts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Unique Sounds</Text>
        </View>
      </View>
      
      {/* Daily/Weekly Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Activity</Text>
        <BarChart data={weeklyData} height={180} />
        <Text style={styles.sectionDescription}>
          This chart shows when you typically encounter audio alerts throughout the week.
        </Text>
      </View>
      
      {/* Alert Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Categories</Text>
        <BarChart data={categoryData} height={200} horizontal={true} />
        <Text style={styles.sectionDescription}>
          A breakdown of different alert types you've encountered this {timeFrame}.
        </Text>
      </View>
      
      {/* Tab Navigator */}
      <View style={styles.tabSelector}>
        <TouchableOpacity 
          style={[styles.tabButton, insightTab === 'trends' && styles.tabButtonActive]}
          onPress={() => setInsightTab('trends')}
        >
          <Text style={[styles.tabText, insightTab === 'trends' && styles.tabTextActive]}>
            Trends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, insightTab === 'sounds' && styles.tabButtonActive]}
          onPress={() => setInsightTab('sounds')}
        >
          <Text style={[styles.tabText, insightTab === 'sounds' && styles.tabTextActive]}>
            Sounds
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, insightTab === 'predictions' && styles.tabButtonActive]}
          onPress={() => setInsightTab('predictions')}
        >
          <Text style={[styles.tabText, insightTab === 'predictions' && styles.tabTextActive]}>
            Predictions
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Content */}
      {insightTab === 'sounds' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recurring Sounds</Text>
          <View style={styles.recurringSoundItem}>
            <Ionicons name="train" size={24} color="#FF7D3B" style={styles.soundIcon} />
            <View style={styles.soundInfo}>
              <Text style={styles.soundTitle}>Train Station Announcements</Text>
              <Text style={styles.soundFrequency}>Weekdays, 8:00 AM - 9:00 AM</Text>
            </View>
            <View style={styles.soundBadge}>
              <Text style={styles.soundBadgeText}>22</Text>
            </View>
          </View>
          
          <View style={styles.recurringSoundItem}>
            <Ionicons name="alarm" size={24} color="#FF3B30" style={styles.soundIcon} />
            <View style={styles.soundInfo}>
              <Text style={styles.soundTitle}>Alarm Clock</Text>
              <Text style={styles.soundFrequency}>Daily, 7:30 AM</Text>
            </View>
            <View style={styles.soundBadge}>
              <Text style={styles.soundBadgeText}>14</Text>
            </View>
          </View>
          
          <View style={styles.recurringSoundItem}>
            <Ionicons name="notifications" size={24} color="#FFCC00" style={styles.soundIcon} />
            <View style={styles.soundInfo}>
              <Text style={styles.soundTitle}>Doorbell</Text>
              <Text style={styles.soundFrequency}>Weekends, Various times</Text>
            </View>
            <View style={styles.soundBadge}>
              <Text style={styles.soundBadgeText}>9</Text>
            </View>
          </View>
        </View>
      )}
      
      {insightTab === 'trends' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trend Analysis</Text>
          <View style={styles.trendItem}>
            <View style={styles.trendIcon}>
              <Ionicons name="trending-up" size={24} color="#34C759" />
            </View>
            <View style={styles.trendInfo}>
              <Text style={styles.trendTitle}>Increased Transit Notifications</Text>
              <Text style={styles.trendDescription}>22% more than last week</Text>
            </View>
          </View>
          
          <View style={styles.trendItem}>
            <View style={styles.trendIcon}>
              <Ionicons name="trending-down" size={24} color="#FF3B30" />
            </View>
            <View style={styles.trendInfo}>
              <Text style={styles.trendTitle}>Fewer Emergency Alerts</Text>
              <Text style={styles.trendDescription}>15% reduction from previous month</Text>
            </View>
          </View>
          
          <Text style={styles.insightText}>
            Your alert patterns show you're spending more time in public transit areas and less time in areas with emergency alerts.
          </Text>
        </View>
      )}
      
      {insightTab === 'predictions' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Predictive Intelligence</Text>
          <Text style={styles.predictionText}>
            Based on your patterns, we'll start preparing for:
          </Text>
          
          <View style={styles.predictionItem}>
            <Ionicons name="calendar" size={24} color="#FF7D3B" />
            <Text style={styles.predictionItemText}>
              Train announcements on weekday mornings between 8:00-9:00 AM
            </Text>
          </View>
          
          <View style={styles.predictionItem}>
            <Ionicons name="notifications" size={24} color="#FF7D3B" />
            <Text style={styles.predictionItemText}>
              Doorbell sounds on Saturday afternoons
            </Text>
          </View>
          
          <View style={styles.predictionItem}>
            <Ionicons name="volume-high" size={24} color="#FF7D3B" />
            <Text style={styles.predictionItemText}>
              Shopping mall announcements on Sundays
            </Text>
          </View>
        </View>
      )}
      
      {/* Additional Resources */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning From Your Data</Text>
        <TouchableOpacity style={styles.resourceButton}>
          <Ionicons name="download-outline" size={20} color="#FFFFFF" style={styles.resourceIcon} />
          <Text style={styles.resourceText}>Export Analytics Data</Text>
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
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1C1C1E',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 12,
  },
  // Chart styles
  chartContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 16,
    justifyContent: 'flex-end',
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  horizontalBar: {
    height: 20,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  horizontalLabels: {
    position: 'absolute',
    left: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  horizontalLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  // Time selector styles
  timeSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 16,
    marginBottom: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  timeButtonActive: {
    backgroundColor: '#FF7D3B',
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  timeButtonTextActive: {
    color: '#FFFFFF',
  },
  // Stats styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    width: '31%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF7D3B',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 4,
  },
  // Tab selector styles
  tabSelector: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    marginHorizontal: 16,
    marginTop: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF7D3B',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  tabTextActive: {
    color: '#FF7D3B',
  },
  // Sound item styles
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
  soundBadge: {
    backgroundColor: '#F2F2F7',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  // Trend styles
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  trendIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  trendInfo: {
    flex: 1,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  trendDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  insightText: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 16,
    color: '#1C1C1E',
  },
  // Prediction styles
  predictionText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F9F9FB',
    padding: 12,
    borderRadius: 8,
  },
  predictionItemText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  // Resource button
  resourceButton: {
    backgroundColor: '#FF7D3B',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  resourceIcon: {
    marginRight: 8,
  },
  resourceText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});