import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Platform,
  Switch,
  AppRegistry,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

// Sample event data
const events = [
  { id: '1', type: 'critical', title: 'Emergency Siren Detected', time: '2 mins ago', summary: 'Emergency vehicle siren detected nearby' },
  { id: '2', type: 'urgent', title: 'Train Announcement', time: '15 mins ago', summary: 'Platform change for the 3:30 departure' },
  { id: '3', type: 'info', title: 'Store Announcement', time: '45 mins ago', summary: 'Special offer in electronics department' },
  { id: '4', type: 'critical', title: 'Fire Alarm', time: '1 hour ago', summary: 'Building evacuation required' },
  { id: '5', type: 'info', title: 'Airport Announcement', time: '3 hours ago', summary: 'Gate change for Flight AC327' },
];

// Sample event details
const eventData = {
  '1': {
    id: '1',
    type: 'critical',
    title: 'Emergency Siren Detected',
    time: '2 mins ago',
    location: 'Main Street',
    fullText: 'Emergency vehicle siren approaching from the east. Please clear the road if you are driving.',
    translatedText: 'Sirena de vehículo de emergencia acercándose desde el este. Por favor, despeje el camino si está conduciendo.',
    timestamp: '2023-07-15 14:23:45',
  },
  '2': {
    id: '2',
    type: 'urgent',
    title: 'Train Announcement',
    time: '15 mins ago',
    location: 'Central Station',
    fullText: 'Attention passengers: The 3:30 PM departure to Downtown has been moved from Platform 2 to Platform 5. We apologize for any inconvenience.',
    translatedText: 'Atención pasajeros: La salida de las 3:30 PM hacia el centro ha sido trasladada de la Plataforma 2 a la Plataforma 5. Nos disculpamos por cualquier inconveniente.',
    timestamp: '2023-07-15 14:10:22',
  }
};

// Function to get color based on event type
const getEventColor = (type) => {
  switch (type) {
    case 'critical': return '#FF3B30';
    case 'urgent': return '#FFCC00';
    case 'info': return '#8E8E93';
    default: return '#8E8E93';
  }
};

// Function to get icon based on event type
const getEventIcon = (type) => {
  switch (type) {
    case 'critical': return 'warning-outline';
    case 'urgent': return 'alert-circle-outline';
    case 'info': return 'information-circle-outline';
    default: return 'information-circle-outline';
  }
};

// HomeScreen Component
function HomeScreen({ onSelectEvent }) {
  const [filterType, setFilterType] = useState('all'); // 'all', 'critical', 'urgent', 'info'
  const [sortBy, setSortBy] = useState('time'); // 'time', 'type'
  
  // Sort and filter events
  const getFilteredEvents = () => {
    // First filter by type
    let filteredData = events;
    if (filterType !== 'all') {
      filteredData = events.filter(item => item.type === filterType);
    }
    
    // Then sort
    return [...filteredData].sort((a, b) => {
      if (sortBy === 'time') {
        return parseInt(a.id) - parseInt(b.id); // Using id as a proxy for time (lower id = more recent)
      } else if (sortBy === 'type') {
        // Sort by priority - critical first, then urgent, then info
        const typePriority = { 'critical': 1, 'urgent': 2, 'info': 3 };
        return typePriority[a.type] - typePriority[b.type];
      }
      return 0;
    });
  };
  
  // Group events by date
  const groupedEvents = () => {
    const groups = {
      'Today': [],
      'Yesterday': [],
      'Earlier': []
    };
    
    getFilteredEvents().forEach(event => {
      // In a real app, you would use actual date logic here
      if (event.id === '1' || event.id === '2') {
        groups['Today'].push(event);
      } else if (event.id === '3') {
        groups['Yesterday'].push(event);
      } else {
        groups['Earlier'].push(event);
      }
    });
    
    return groups;
  };
  
  const renderEventItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventItem}
      onPress={() => { try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}; onSelectEvent(item.id); }}
    >
      <View style={styles.eventHeader}>
        <View style={[styles.eventIconContainer, { backgroundColor: getEventColor(item.type) + '20' }]}>
          <Ionicons name={getEventIcon(item.type)} size={20} color={getEventColor(item.type)} />
        </View>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventTime}>{item.time}</Text>
      </View>
      <Text style={styles.eventSummary}>{item.summary}</Text>
      <View style={[styles.eventTypeIndicator, { backgroundColor: getEventColor(item.type) }]} />
    </TouchableOpacity>
  );

  const groups = groupedEvents();
  const hasEvents = Object.values(groups).some(group => group.length > 0);

  return (
    <View style={styles.screenContainer}>
      <StatusBar
        backgroundColor="#FF7D3B"
        barStyle="light-content"
        translucent={true}
      />
      <View style={styles.safeTopPadding} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Real-Time Event Log</Text>
        <Text style={styles.subtitle}>Your audio copilot is active</Text>
      </View>
      
      {/* Filter and sort controls */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.filterButton, filterType === 'all' && styles.filterButtonActive]}
            onPress={() => { try { Haptics.selectionAsync(); } catch {}; setFilterType('all'); }}
          >
            <Text style={[styles.filterButtonText, filterType === 'all' && styles.filterButtonTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filterType === 'critical' && styles.filterButtonActive]}
            onPress={() => { try { Haptics.selectionAsync(); } catch {}; setFilterType('critical'); }}
          >
            <View style={[styles.filterIndicator, {backgroundColor: '#FF3B30'}]} />
            <Text style={[styles.filterButtonText, filterType === 'critical' && styles.filterButtonTextActive]}>Critical</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filterType === 'urgent' && styles.filterButtonActive]}
            onPress={() => { try { Haptics.selectionAsync(); } catch {}; setFilterType('urgent'); }}
          >
            <View style={[styles.filterIndicator, {backgroundColor: '#FFCC00'}]} />
            <Text style={[styles.filterButtonText, filterType === 'urgent' && styles.filterButtonTextActive]}>Urgent</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filterType === 'info' && styles.filterButtonActive]}
            onPress={() => { try { Haptics.selectionAsync(); } catch {}; setFilterType('info'); }}
          >
            <View style={[styles.filterIndicator, {backgroundColor: '#8E8E93'}]} />
            <Text style={[styles.filterButtonText, filterType === 'info' && styles.filterButtonTextActive]}>Info</Text>
          </TouchableOpacity>
        </ScrollView>
        
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort:</Text>
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => { try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}; setSortBy(sortBy === 'time' ? 'type' : 'time'); }}
          >
            <Text style={styles.sortButtonText}>
              {sortBy === 'time' ? 'Latest First' : 'By Priority'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      </View>
      
      {hasEvents ? (
        <ScrollView style={styles.eventList} contentContainerStyle={{paddingBottom: 32, paddingTop: 4}}>
          {Object.entries(groups).map(([date, dateEvents]) => {
            if (dateEvents.length === 0) return null;
            
            return (
              <View key={date}>
                <Text style={styles.dateHeader}>{date}</Text>
                {dateEvents.map(item => (
                  <View key={item.id}>
                    {renderEventItem({ item })}
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle" size={64} color="#D1D1D6" />
          <Text style={styles.emptyText}>No events match your filters</Text>
        </View>
      )}
    </View>
  );
}

// ExploreScreen Component
function ExploreScreen({ onSelectEvent }) {
  return (
    <View style={styles.screenContainer}>
      <StatusBar
        backgroundColor="#FF7D3B"
        barStyle="light-content"
        translucent={true}
      />
      <View style={styles.safeTopPadding} />
      <View style={styles.header}>
        <Text style={styles.title}>Explore Events</Text>
        <Text style={styles.subtitle}>Filter and find specific events</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.placeholderText}>This would be the Explore Events tab</Text>
        <TouchableOpacity style={styles.button} onPress={() => onSelectEvent('1')}>
          <Text style={styles.buttonText}>View Sample Event</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// SettingsScreen Component
function SettingsScreen() {
  // Sample state for settings demonstration
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    vibrationHaptics: true,
    flashlightNotification: false,
    increasedVolume: true,
    visualIndicators: false,
    reduceMotion: false,
  });
  
  const [alertSettings, setAlertSettings] = useState({
    sirens: true,
    publicTransport: true,
    storeAnnouncements: false,
  });
  
  // Toggle accessibility settings
  const toggleAccessibilitySetting = (setting) => {
    setAccessibilitySettings({
      ...accessibilitySettings,
      [setting]: !accessibilitySettings[setting]
    });
    try { Haptics.selectionAsync(); } catch {}
  };
  
  // Toggle alert settings
  const toggleAlertSetting = (setting) => {
    setAlertSettings({
      ...alertSettings,
      [setting]: !alertSettings[setting]
    });
    try { Haptics.selectionAsync(); } catch {}
  };
  
  return (
    <View style={styles.screenContainer}>
      <StatusBar
        backgroundColor="#FF7D3B"
        barStyle="light-content"
        translucent={true}
      />
      <View style={styles.safeTopPadding} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your preferences</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 32, paddingTop: 4}}>
        {/* Accessibility Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Accessibility</Text>
          
          <View style={styles.settingItem}>
            <View style={{flex: 1}}>
              <Text style={styles.settingLabel}>Vibration Haptics</Text>
              <Text style={styles.settingDescription}>Vibrate when notifications are received</Text>
            </View>
            <Switch
              value={accessibilitySettings.vibrationHaptics}
              onValueChange={() => toggleAccessibilitySetting('vibrationHaptics')}
              trackColor={{ false: '#D1D1D6', true: '#FF7D3B' }}
              thumbColor={accessibilitySettings.vibrationHaptics ? '#FFFFFF' : '#F4F4F4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={{flex: 1}}>
              <Text style={styles.settingLabel}>Flashlight Notifications</Text>
              <Text style={styles.settingDescription}>Flash light for critical alerts</Text>
            </View>
            <Switch
              value={accessibilitySettings.flashlightNotification}
              onValueChange={() => toggleAccessibilitySetting('flashlightNotification')}
              trackColor={{ false: '#D1D1D6', true: '#FF7D3B' }}
              thumbColor={accessibilitySettings.flashlightNotification ? '#FFFFFF' : '#F4F4F4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={{flex: 1}}>
              <Text style={styles.settingLabel}>Visual Indicators</Text>
              <Text style={styles.settingDescription}>Show on-screen alerts with color coding</Text>
            </View>
            <Switch
              value={accessibilitySettings.visualIndicators}
              onValueChange={() => toggleAccessibilitySetting('visualIndicators')}
              trackColor={{ false: '#D1D1D6', true: '#FF7D3B' }}
              thumbColor={accessibilitySettings.visualIndicators ? '#FFFFFF' : '#F4F4F4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={{flex: 1}}>
              <Text style={styles.settingLabel}>Reduce Motion</Text>
              <Text style={styles.settingDescription}>Minimize animations in the app</Text>
            </View>
            <Switch
              value={accessibilitySettings.reduceMotion}
              onValueChange={() => toggleAccessibilitySetting('reduceMotion')}
              trackColor={{ false: '#D1D1D6', true: '#FF7D3B' }}
              thumbColor={accessibilitySettings.reduceMotion ? '#FFFFFF' : '#F4F4F4'}
            />
          </View>
        </View>
        
        {/* Alert Categories Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Alert Categories</Text>
          
          <View style={styles.settingItem}>
            <View style={{flex: 1}}>
              <Text style={styles.settingLabel}>Sirens & Alarms</Text>
              <Text style={styles.settingDescription}>Emergency vehicles and alerts</Text>
            </View>
            <Switch
              value={alertSettings.sirens}
              onValueChange={() => toggleAlertSetting('sirens')}
              trackColor={{ false: '#D1D1D6', true: '#FF7D3B' }}
              thumbColor={alertSettings.sirens ? '#FFFFFF' : '#F4F4F4'}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// AnalyticsScreen Component
function AnalyticsScreen() {
  const [timeFrame, setTimeFrame] = useState('week'); // 'day', 'week', 'month'
  
  return (
    <View style={styles.screenContainer}>
      <StatusBar
        backgroundColor="#FF7D3B"
        barStyle="light-content"
        translucent={true}
      />
      <View style={styles.safeTopPadding} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Analytics & Insights</Text>
        <Text style={styles.subtitle}>Understanding your audio environment</Text>
      </View>
      
      <ScrollView contentContainerStyle={{paddingBottom: 32, paddingTop: 4}}>
        <View style={styles.analyticsTimeSelector}>
          <TouchableOpacity 
            style={[styles.analyticsTimeButton, timeFrame === 'day' && styles.analyticsTimeButtonActive]}
            onPress={() => setTimeFrame('day')}
          >
            <Text style={styles.analyticsTimeButtonText}>
              Day
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.analyticsTimeButton, timeFrame === 'week' && styles.analyticsTimeButtonActive]}
            onPress={() => setTimeFrame('week')}
          >
            <Text style={styles.analyticsTimeButtonText}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.analyticsTimeButton, timeFrame === 'month' && styles.analyticsTimeButtonActive]}
            onPress={() => setTimeFrame('month')}
          >
            <Text style={styles.analyticsTimeButtonText}>
              Month
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.analyticsStatsRow}>
          <View style={styles.analyticsStat}>
            <Text style={styles.analyticsStatNumber}>73</Text>
            <Text style={styles.analyticsStatLabel}>Total Events</Text>
          </View>
          <View style={styles.analyticsStat}>
            <Text style={styles.analyticsStatNumber}>7</Text>
            <Text style={styles.analyticsStatLabel}>Critical</Text>
          </View>
          <View style={styles.analyticsStat}>
            <Text style={styles.analyticsStatNumber}>12</Text>
            <Text style={styles.analyticsStatLabel}>Sounds</Text>
          </View>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Top Sound Categories</Text>
          <View style={styles.analyticsBarContainer}>
            <View style={styles.analyticsBarItem}>
              <View style={styles.analyticsBarLabel}>
                <Text style={styles.analyticsBarText}>Transit</Text>
              </View>
              <View style={[styles.analyticsBar, { width: '80%', backgroundColor: '#FFCC00' }]} />
              <Text style={styles.analyticsBarValue}>22</Text>
            </View>
            <View style={styles.analyticsBarItem}>
              <View style={styles.analyticsBarLabel}>
                <Text style={styles.analyticsBarText}>Doorbell</Text>
              </View>
              <View style={[styles.analyticsBar, { width: '50%', backgroundColor: '#5856D6' }]} />
              <Text style={styles.analyticsBarValue}>14</Text>
            </View>
            <View style={styles.analyticsBarItem}>
              <View style={styles.analyticsBarLabel}>
                <Text style={styles.analyticsBarText}>Sirens</Text>
              </View>
              <View style={[styles.analyticsBar, { width: '25%', backgroundColor: '#FF3B30' }]} />
              <Text style={styles.analyticsBarValue}>7</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// EventDetailScreen Component
function EventDetailScreen({ eventId, onBack }) {
  const event = eventData[eventId];
  const [showTranslation, setShowTranslation] = useState(false);
  const [simplified, setSimplified] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5, 1, 1.5, 2
  const [volume, setVolume] = useState(80); // 0-100
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Simplified versions of the messages
  const simplifiedText = {
    '1': 'Emergency vehicle approaching. Clear the road.',
    '2': '3:30 PM train moved to Platform 5.',
    '3': '20% off laptops today.',
    '4': 'Fire alarm. Evacuate immediately.',
    '5': 'Flight AC327 gate changed to C4.',
  };
  
  // Related events based on type
  const getRelatedEvents = () => {
    // In a real app, this would be more sophisticated
    if (!event) return [];
    
    return events.filter(e => e.type === event.type && e.id !== event.id).slice(0, 2);
  };
  
  // Event icon with consistent styling
  const EventTypeIcon = () => (
    <View style={{
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: getEventColor(event.type) + '20',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Ionicons name={getEventIcon(event.type)} size={30} color={getEventColor(event.type)} />
    </View>
  );

  if (!event) {
    return (
      <View style={styles.screenContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.placeholderText}>Event not found</Text>
      </View>
    );
  }

  // Get related events
  const relatedEvents = getRelatedEvents();
  
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#FF7D3B"
        barStyle="light-content"
        translucent={true}
      />
      <View style={styles.safeTopPadding} />
      
      <View style={styles.eventDetailTopBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#FF7D3B" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.eventActions}>
          <TouchableOpacity 
            style={styles.eventActionButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons 
              name={isFavorite ? "star" : "star-outline"} 
              size={24} 
              color={isFavorite ? "#FFD700" : "#8E8E93"} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.eventActionButton}
            onPress={() => setIsArchived(!isArchived)}
          >
            <Ionicons 
              name={isArchived ? "archive" : "archive-outline"} 
              size={24} 
              color="#8E8E93" 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={{paddingBottom: 32, paddingTop: 4}}>
        <View style={[styles.eventDetailHeader, { backgroundColor: getEventColor(event.type) + '15' }]}>
          <View style={styles.eventTypeContainer}>
            <View style={[styles.eventTypeIndicatorDot, {backgroundColor: getEventColor(event.type)}]} />
            <Text style={[styles.eventType, { color: getEventColor(event.type) }]}>
              {event.type.toUpperCase()}
            </Text>
            <Text style={styles.eventTime}>{event.time}</Text>
          </View>
          <EventTypeIcon />
          <Text style={styles.eventDetailTitle}>{event.title}</Text>
          {event.location && (
            <View style={styles.eventLocation}>
              <Ionicons name="location-outline" size={16} color="#8E8E93" />
              <Text style={styles.eventLocationText}>{event.location}</Text>
            </View>
          )}
        </View>
        
        {/* Audio Controls Section */}
        <View style={styles.eventDetailSection}>
          <View style={styles.audioControlsBar}>
            <TouchableOpacity style={styles.audioButton}>
              <Ionicons name="play" size={28} color="#FF7D3B" />
            </TouchableOpacity>
            
            <View style={styles.audioProgressContainer}>
              <View style={styles.audioProgress}>
                <View style={[styles.audioProgressFill, {width: '60%'}]} />
              </View>
              <View style={styles.audioTime}>
                <Text style={styles.audioTimeText}>0:12</Text>
                <Text style={styles.audioTimeText}>0:20</Text>
              </View>
            </View>
            
            <View style={styles.audioOptions}>
              <TouchableOpacity 
                style={styles.speedButton}
                onPress={() => {
                  const speeds = [0.5, 1, 1.5, 2];
                  const currentIndex = speeds.indexOf(playbackSpeed);
                  const nextIndex = (currentIndex + 1) % speeds.length;
                  setPlaybackSpeed(speeds[nextIndex]);
                }}
              >
                <Text style={styles.speedButtonText}>{playbackSpeed}x</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Transcription Section */}
        <View style={styles.eventDetailSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              {simplified ? 'Simplified Message' : 'Full Transcription'}
            </Text>
            <TouchableOpacity 
              style={styles.textOptionButton}
              onPress={() => setSimplified(!simplified)}
            >
              <Text style={styles.textOptionButtonText}>
                {simplified ? 'Show Full' : 'Simplify'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.transcriptionText}>
            {simplified ? simplifiedText[event.id] : event.fullText}
          </Text>
          
          {!showTranslation && (
            <TouchableOpacity 
              style={styles.translationButton}
              onPress={() => setShowTranslation(true)}
            >
              <Ionicons name="language-outline" size={18} color="#FF7D3B" />
              <Text style={styles.translationButtonText}>Translate to Spanish</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Translation Section (if shown) */}
        {showTranslation && (
          <View style={styles.eventDetailSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Spanish Translation</Text>
              <TouchableOpacity 
                style={styles.textOptionButton}
                onPress={() => setShowTranslation(false)}
              >
                <Text style={styles.textOptionButtonText}>Hide</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.translationText}>{event.translatedText}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// OnboardingScreen Component
function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(1);
  const [micStatus, setMicStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');

  useEffect(() => {
    (async () => {
      try {
        const perm = await Audio.getPermissionsAsync();
        setMicStatus((perm?.status as any) ?? 'undetermined');
      } catch {}
    })();
  }, []);

  const requestMic = async () => {
    try {
      const result = await Audio.requestPermissionsAsync();
      setMicStatus((result?.status as any) ?? 'undetermined');
      if (result?.status === 'granted') {
        try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
      } else {
        try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); } catch {}
      }
    } catch {}
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };
  
  return (
    <View style={styles.screenContainer}>
      {/* StatusBar configuration for OnboardingScreen */}
      <StatusBar
        backgroundColor="#FF7D3B"
        barStyle="light-content"
        translucent={true}
      />
      <View style={styles.safeTopPadding} />
      
      {step === 1 && (
        <View style={styles.stepContainer}>
          <View style={styles.imagePlaceholder} />
          <Text style={styles.onboardingTitle}>Welcome to Ping</Text>
          <Text style={styles.onboardingSubtitle}>
            An intelligent co-pilot for your ears that ensures you never miss what matters.
          </Text>
          
          <View style={styles.permissionContainer}>
            <Ionicons name="mic" size={24} color="#007AFF" />
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>Microphone Access</Text>
              <Text style={styles.permissionDescription}>
                Required for continuous audio capture
              </Text>
              <Text style={[styles.permissionDescription, { marginTop: 4, color: micStatus === 'granted' ? '#28A745' : micStatus === 'denied' ? '#FF3B30' : '#666' }]}>Status: {micStatus}</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.button, { alignSelf: 'stretch', backgroundColor: micStatus === 'granted' ? '#34C759' : '#FF7D3B' }]} onPress={requestMic}>
            <Text style={styles.buttonText}>{micStatus === 'granted' ? 'Microphone Enabled' : 'Enable Microphone'}</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {step === 2 && (
        <View style={styles.stepContainer}>
          <View style={styles.imagePlaceholder} />
          <Text style={styles.onboardingTitle}>Set Up Languages</Text>
          <Text style={styles.onboardingSubtitle}>
            Select languages for offline translation
          </Text>
        </View>
      )}
      
      {step === 3 && (
        <View style={styles.stepContainer}>
          <View style={styles.imagePlaceholder} />
          <Text style={styles.onboardingTitle}>Choose Your Alerts</Text>
          <Text style={styles.onboardingSubtitle}>
            Select which sounds to be alerted about
          </Text>
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

// Define all styles for the application with our orange-white design language
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  safeTopPadding: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
    backgroundColor: '#FF7D3B',
  },
  scrollContent: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  settingsSection: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    minHeight: 60,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
    marginTop: 2,
  },
  // Analytics styles
  analyticsTimeSelector: {
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
  analyticsTimeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  analyticsTimeButtonActive: {
    backgroundColor: '#FF7D3B',
  },
  analyticsTimeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  analyticsStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  analyticsStat: {
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
  analyticsStatNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF7D3B',
  },
  analyticsStatLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 4,
  },
  analyticsBarContainer: {
    marginTop: 16,
  },
  analyticsBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  analyticsBarLabel: {
    width: 80,
  },
  analyticsBarText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  analyticsBar: {
    height: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 12,
  },
  analyticsBarValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    width: 30,
    textAlign: 'right',
  },
  // Filter and sort styles for events
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterScroll: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingVertical: 4,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 22,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonActive: {
    backgroundColor: '#FF7D3B',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  filterIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  sortLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  sortButtonText: {
    fontSize: 13,
    color: '#6D6D72',
    marginRight: 4,
    fontWeight: '500',
  },
  dateHeader: {
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
  },
  // Event Detail enhanced styles
  eventDetailTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  eventActions: {
    flexDirection: 'row',
  },
  eventActionButton: {
    padding: 8,
    marginLeft: 16,
  },
  eventTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTypeIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  eventLocationText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 4,
  },
  audioControlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#F9F9FB',
    borderRadius: 12,
  },
  audioButton: {
    padding: 8,
  },
  audioProgressContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  audioProgress: {
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
  },
  audioProgressFill: {
    height: 4,
    backgroundColor: '#FF7D3B',
    borderRadius: 2,
  },
  audioTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  audioTimeText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  audioOptions: {
    marginLeft: 8,
  },
  speedButton: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  speedButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  textOptionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  textOptionButtonText: {
    fontSize: 14,
    color: '#FF7D3B',
    fontWeight: '500',
  },
  translationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  translationButtonText: {
    color: '#FF7D3B',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  relatedEventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9FB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  relatedEventIndicator: {
    width: 8,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  relatedEventContent: {
    flex: 1,
  },
  relatedEventTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  relatedEventSummary: {
    fontSize: 12,
    color: '#8E8E93',
  },
  relatedEventTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  header: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#FF7D3B', // Orange header
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    fontFamily: 'System',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#FF7D3B',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  eventList: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 8,
  },
  eventItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    color: '#1C1C1E',
    lineHeight: 22,
  },
  eventTime: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 2,
  },
  eventSummary: {
    fontSize: 15,
    color: '#555555',
    lineHeight: 21,
    marginTop: 4,
    paddingLeft: 48, // Align with the icon indent
  },
  eventIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  eventTypeIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  tabLabel: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#FF7D3B',
    fontWeight: '600',
  },
  // Event Detail Styles
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 20,
  },
  backText: {
    fontSize: 16,
    color: '#FF7D3B',
    marginLeft: 6,
    fontWeight: '500',
  },
  eventDetailHeader: {
    alignItems: 'center',
    padding: 32,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
  },
  eventType: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  eventDetailTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
    color: '#333333',
    lineHeight: 32,
  },
  eventDetailSection: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1C1C1E',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  transcriptionText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#444444',
  },
  translationText: {
    fontSize: 16,
    lineHeight: 26,
    fontStyle: 'italic',
    color: '#444444',
    backgroundColor: '#FAFAFA',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF7D3B',
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: '#FF7D3B',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  // Onboarding styles
  stepContainer: {
    flex: 1,
    padding: 32,
    paddingTop: 48,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  imagePlaceholder: {
    width: 220,
    height: 220,
    backgroundColor: '#FF7D3B',
    opacity: 0.9,
    borderRadius: 110,
    marginBottom: 40,
    shadowColor: '#FF7D3B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
  },
  onboardingTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333333',
    letterSpacing: -0.5,
  },
  onboardingSubtitle: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666666',
    lineHeight: 24,
    paddingHorizontal: 20,
    fontWeight: '400',
  },
  permissionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  permissionText: {
    marginLeft: 16,
    flex: 1,
    marginTop: 2,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  pagination: {
    flexDirection: 'row',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDDDDD',
    marginRight: 8,
  },
  activeDot: {
    backgroundColor: '#FF7D3B',
    width: 24,
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: '#FF7D3B',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#FF7D3B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default function App() {
  const [activeScreen, setActiveScreen] = useState('onboarding'); // onboarding, home, explore, settings, analytics, eventDetail
  const [selectedEventId, setSelectedEventId] = useState(null);
  
  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId);
    setActiveScreen('eventDetail');
  };
  
  const handleCompleteOnboarding = () => {
    setActiveScreen('home');
  };
  
  const handleBackToHome = () => {
    setActiveScreen('home');
  };

  // Render the appropriate screen
  const renderScreen = () => {
    switch (activeScreen) {
      case 'onboarding':
        return <OnboardingScreen onComplete={handleCompleteOnboarding} />;
      case 'home':
        return <HomeScreen onSelectEvent={handleSelectEvent} />;
      case 'explore':
        return <ExploreScreen onSelectEvent={handleSelectEvent} />;
      case 'settings':
        return <SettingsScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'eventDetail':
        return <EventDetailScreen eventId={selectedEventId} onBack={handleBackToHome} />;
      default:
        return <HomeScreen onSelectEvent={handleSelectEvent} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#FF7D3B"
        barStyle="light-content"
        translucent={true}
      />
      {renderScreen()}
      
      {activeScreen !== 'onboarding' && activeScreen !== 'eventDetail' && (
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => setActiveScreen('home')}
          >
            <Ionicons 
              name={activeScreen === 'home' ? 'home' : 'home-outline'} 
              size={24} 
              color={activeScreen === 'home' ? '#FF7D3B' : '#8E8E93'} 
            />
            <Text style={[
              styles.tabLabel, 
              activeScreen === 'home' && styles.activeTabLabel
            ]}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabItem}
            onPress={() => setActiveScreen('explore')}
          >
            <Ionicons 
              name={activeScreen === 'explore' ? 'grid' : 'grid-outline'} 
              size={24} 
              color={activeScreen === 'explore' ? '#FF7D3B' : '#8E8E93'} 
            />
            <Text style={[
              styles.tabLabel, 
              activeScreen === 'explore' && styles.activeTabLabel
            ]}>Events</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabItem}
            onPress={() => setActiveScreen('settings')}
          >
            <Ionicons 
              name={activeScreen === 'settings' ? 'settings' : 'settings-outline'} 
              size={24} 
              color={activeScreen === 'settings' ? '#FF7D3B' : '#8E8E93'} 
            />
            <Text style={[
              styles.tabLabel, 
              activeScreen === 'settings' && styles.activeTabLabel
            ]}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabItem}
            onPress={() => setActiveScreen('analytics')}
          >
            <Ionicons 
              name={activeScreen === 'analytics' ? 'stats-chart' : 'stats-chart-outline'} 
              size={24} 
              color={activeScreen === 'analytics' ? '#FF7D3B' : '#8E8E93'} 
            />
            <Text style={[
              styles.tabLabel, 
              activeScreen === 'analytics' && styles.activeTabLabel
            ]}>Insights</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Register the main component
AppRegistry.registerComponent('main', () => App);
