import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendNotification } from './NotificationService';
import { getAlerts, AlertEvent } from './DatabaseService';

const PATTERNS_STORAGE_KEY = 'ping_patterns';

export interface LocationPattern {
  latitude: number;
  longitude: number;
  expectedEvent: string;
  hour: number;
  minute: number;
  toleranceMinutes: number;
  occurrences: number;
}

export const requestLocationPermissions = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return false;
  }
  return true;
};

export const savePattern = async (pattern: LocationPattern) => {
  try {
    const existing = await AsyncStorage.getItem(PATTERNS_STORAGE_KEY);
    const patterns: LocationPattern[] = existing ? JSON.parse(existing) : [];

    // Check if pattern exists and update it, else push
    const existingPatternIndex = patterns.findIndex(p =>
      getDistanceFromLatLonInKm(p.latitude, p.longitude, pattern.latitude, pattern.longitude) < 0.2 &&
      Math.abs((p.hour * 60 + p.minute) - (pattern.hour * 60 + pattern.minute)) <= pattern.toleranceMinutes &&
      p.expectedEvent === pattern.expectedEvent
    );

    if (existingPatternIndex > -1) {
      patterns[existingPatternIndex].occurrences += 1;
    } else {
      patterns.push({...pattern, occurrences: 1});
    }

    await AsyncStorage.setItem(PATTERNS_STORAGE_KEY, JSON.stringify(patterns));
  } catch (error) {
    console.error("Error saving pattern", error);
  }
};

export const analyzeHistoricalDataAndGeneratePatterns = async () => {
  try {
    const alerts = await getAlerts(100); // Get past 100 alerts to analyze
    // Group alerts by approximate location and time
    // For simplicity, we just look at the location string (if we had lat/long per event we'd use that)
    // Since our database model currently stores a string for 'location', we'll rely on generating patterns
    // when an event actually happens and we have the device's current lat/long.

    // A better approach: Whenever a new alert is generated, we immediately record the location
    // and try to form a pattern from it.
  } catch (error) {
    console.error("Error analyzing historical data", error);
  }
}

export const recordEventForPattern = async (event: AlertEvent, locationCoords: Location.LocationObjectCoords) => {
  try {
    const date = new Date(event.timestamp);
    const pattern: LocationPattern = {
      latitude: locationCoords.latitude,
      longitude: locationCoords.longitude,
      expectedEvent: event.transcription || event.eventType,
      hour: date.getHours(),
      minute: date.getMinutes(),
      toleranceMinutes: 30, // 30 min tolerance window
      occurrences: 1
    };
    await savePattern(pattern);
  } catch (error) {
    console.error("Error recording event for pattern", error);
  }
}


export const checkPredictiveAlerts = async () => {
  const hasPermission = await requestLocationPermissions();
  if (!hasPermission) return;

  try {
    const location = await Location.getCurrentPositionAsync({});
    const existing = await AsyncStorage.getItem(PATTERNS_STORAGE_KEY);
    const patterns: LocationPattern[] = existing ? JSON.parse(existing) : [];

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (const pattern of patterns) {
      // Only trigger if we've seen this pattern at least 2 times before
      if (pattern.occurrences < 2) continue;

      // Very basic geofencing (distance check) - approx 500 meters
      const distance = getDistanceFromLatLonInKm(
        location.coords.latitude,
        location.coords.longitude,
        pattern.latitude,
        pattern.longitude
      );

      if (distance < 0.5) { // 500m radius
        const timeDiff = Math.abs((currentHour * 60 + currentMinute) - (pattern.hour * 60 + pattern.minute));
        if (timeDiff <= pattern.toleranceMinutes) {
          // Preemptively alert user
          await sendNotification(
            "Predictive Alert",
            `You are near a known location. Expecting the usual ${pattern.expectedEvent} soon.`,
            'Informational'
          );
        }
      }
    }
  } catch (error) {
    console.error("Error checking predictive alerts", error);
  }
};

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}
