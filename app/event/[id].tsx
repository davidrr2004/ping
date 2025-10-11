import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Sample event data (in a real app, you'd fetch this based on the ID)
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
  },
  '3': {
    id: '3',
    type: 'info',
    title: 'Store Announcement',
    time: '45 mins ago',
    location: 'Shopping Mall',
    fullText: 'Attention shoppers: There is a special promotion in the electronics department. All laptops are 20% off today only.',
    translatedText: 'Atención compradores: Hay una promoción especial en el departamento de electrónica. Todas las laptops tienen un 20% de descuento solo por hoy.',
    timestamp: '2023-07-15 13:40:12',
  },
  '4': {
    id: '4',
    type: 'critical',
    title: 'Fire Alarm',
    time: '1 hour ago',
    location: 'Office Building',
    fullText: 'Attention all occupants: This is a fire alarm. Please evacuate the building immediately using the nearest exit. Do not use elevators.',
    translatedText: 'Atención a todos los ocupantes: Esta es una alarma de incendio. Por favor, evacue el edificio inmediatamente usando la salida más cercana. No use los ascensores.',
    timestamp: '2023-07-15 13:25:33',
  },
  '5': {
    id: '5',
    type: 'info',
    title: 'Airport Announcement',
    time: '3 hours ago',
    location: 'Terminal B',
    fullText: 'Attention passengers of Flight AC327 to Vancouver: Your gate has been changed from B12 to C4. Boarding will begin in 30 minutes.',
    translatedText: 'Atención pasajeros del vuelo AC327 a Vancouver: Su puerta ha sido cambiada de B12 a C4. El embarque comenzará en 30 minutos.',
    timestamp: '2023-07-15 11:15:45',
  },
};

export default function EventDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const event = eventData[id];
  
  const [showTranslation, setShowTranslation] = useState(false);
  const [simplified, setSimplified] = useState(false);
  
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
  
  // Simplified versions of the messages
  const simplifiedText = {
    '1': 'Emergency vehicle approaching. Clear the road.',
    '2': '3:30 PM train moved to Platform 5.',
    '3': '20% off laptops today.',
    '4': 'Fire alarm. Evacuate immediately.',
    '5': 'Flight AC327 gate changed to C4.',
  };

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#007AFF" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      
      <View style={[styles.header, { backgroundColor: getEventColor(event.type) + '20' }]}>
        <Ionicons name={getEventIcon(event.type)} size={32} color={getEventColor(event.type)} />
        <Text style={[styles.eventType, { color: getEventColor(event.type) }]}>
          {event.type.toUpperCase()}
        </Text>
        <Text style={styles.title}>{event.title}</Text>
      </View>
      
      <View style={styles.section}>
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
      
      <View style={styles.section}>
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
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Metadata</Text>
        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Timestamp:</Text>
          <Text style={styles.metadataValue}>{event.timestamp}</Text>
        </View>
        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Location:</Text>
          <Text style={styles.metadataValue}>{event.location}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 4,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  eventType: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  transcriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  translationText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  metadataItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metadataLabel: {
    fontSize: 16,
    fontWeight: '500',
    width: 100,
  },
  metadataValue: {
    fontSize: 16,
    flex: 1,
  },
});