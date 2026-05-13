import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type UrgencyLevel = 'Informational' | 'Urgent' | 'Critical';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
};

export const triggerHapticFeedback = async (urgency: UrgencyLevel) => {
  switch (urgency) {
    case 'Informational':
      // Subtle feedback or no feedback based on requirements
      // We will do a light impact
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case 'Urgent':
      // Short vibration
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      break;
    case 'Critical':
      // Continuous / intense vibration
      // Since Expo Haptics doesn't have continuous, we can trigger an intense one
      // or multiple intense ones. We'll simulate with an Error notification type which is heavy,
      // and multiple impact heavy
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 200);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 400);
      break;
  }
};

export const sendNotification = async (title: string, body: string, urgency: UrgencyLevel) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: urgency === 'Critical' ? `🚨 ${title}` : urgency === 'Urgent' ? `⚠️ ${title}` : `ℹ️ ${title}`,
      body,
      data: { urgency },
      sound: true,
      priority: urgency === 'Critical' ? Notifications.AndroidNotificationPriority.MAX :
                urgency === 'Urgent' ? Notifications.AndroidNotificationPriority.HIGH :
                Notifications.AndroidNotificationPriority.DEFAULT,
    },
    trigger: null, // Send immediately
  });

  await triggerHapticFeedback(urgency);
};
