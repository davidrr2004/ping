import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList,
  ScrollView,
  Image,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  const renderEventItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventItem}
      onPress={() => onSelectEvent(item.id)}
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

  return (
    <View style={styles.screenContainer}>
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

// ExploreScreen Component
function ExploreScreen({ onSelectEvent }) {
  return (
    <View style={styles.screenContainer}>
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
  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your preferences</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.placeholderText}>This would be the Settings tab</Text>
      </View>
    </View>
  );
}

// AnalyticsScreen Component
function AnalyticsScreen() {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics & Insights</Text>
        <Text style={styles.subtitle}>Understanding your audio environment</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.placeholderText}>This would be the Analytics tab</Text>
      </View>
    </View>
  );
}

// EventDetailScreen Component
function EventDetailScreen({ eventId, onBack }) {
  const event = eventData[eventId];
  const [showTranslation, setShowTranslation] = useState(false);
  const [simplified, setSimplified] = useState(false);
  
  // Simplified versions of the messages
  const simplifiedText = {
    '1': 'Emergency vehicle approaching. Clear the road.',
    '2': '3:30 PM train moved to Platform 5.',
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

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.safeTopPadding} />
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#FF7D3B" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      
      <View style={[styles.eventDetailHeader, { backgroundColor: getEventColor(event.type) + '15' }]}>
        <EventTypeIcon />
        <Text style={[styles.eventType, { color: getEventColor(event.type) }]}>
          {event.type.toUpperCase()}
        </Text>
        <Text style={styles.eventDetailTitle}>{event.title}</Text>
      </View>
      
      <View style={styles.eventDetailSection}>
        <Text style={styles.sectionTitle}>
          {simplified ? 'Simplified Message' : 'Full Transcription'}
        </Text>
        <Text style={styles.transcriptionText}>
          {simplified ? simplifiedText[event.id] : event.fullText}
        </Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setSimplified(!simplified)}
        >
          <Text style={styles.actionButtonText}>
            {simplified ? 'Show Full Text' : 'Simplify'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.eventDetailSection}>
        <Text style={styles.sectionTitle}>
          {showTranslation ? 'Translation' : 'Show Translation'}
        </Text>
        {showTranslation ? (
          <Text style={styles.translationText}>{event.translatedText}</Text>
        ) : (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowTranslation(true)}
          >
            <Text style={styles.actionButtonText}>Translate to Spanish</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

// OnboardingScreen Component
function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(1);
  
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
            </View>
          </View>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  safeTopPadding: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
    backgroundColor: '#FF7D3B',
  },
  header: {
    padding: 24,
    paddingTop: 24, // Reduced from 36 to prevent status bar overlap
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
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 0, // Removed border left, will use indicator instead
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
    color: '#333333',
  },
  eventTime: {
    fontSize: 14,
    color: '#666666',
  },
  eventSummary: {
    fontSize: 15,
    color: '#444444',
    lineHeight: 20,
    paddingLeft: 48, // Align with the icon indent
  },
  eventIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventTypeIndicator: {
    position: 'absolute',
    top: 16,
    left: 0,
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
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
    marginTop: 8,
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
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333333',
    letterSpacing: 0.2,
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
    color: '#555555',
    lineHeight: 26,
    paddingHorizontal: 12,
  },
  permissionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    width: '100%',
    backgroundColor: '#FAFAFA',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  permissionText: {
    marginLeft: 20,
    flex: 1,
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
    <SafeAreaView style={styles.container}>
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
              name="home" 
              size={24} 
              color={activeScreen === 'home' ? '#007AFF' : '#8E8E93'} 
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
              name="list" 
              size={24} 
              color={activeScreen === 'explore' ? '#007AFF' : '#8E8E93'} 
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
              name="settings" 
              size={24} 
              color={activeScreen === 'settings' ? '#007AFF' : '#8E8E93'} 
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
              name="bar-chart" 
              size={24} 
              color={activeScreen === 'analytics' ? '#007AFF' : '#8E8E93'} 
            />
            <Text style={[
              styles.tabLabel, 
              activeScreen === 'analytics' && styles.activeTabLabel
            ]}>Insights</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
