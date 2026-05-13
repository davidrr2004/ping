import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('ping_alerts.db');

export interface AlertEvent {
  id?: number;
  timestamp: string;
  eventType: 'Speech' | 'Alert';
  transcription: string;
  translation: string;
  urgency: 'Informational' | 'Urgent' | 'Critical';
  location: string;
  confidence: number;
}

export const initDB = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS alerts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp TEXT,
          eventType TEXT,
          transcription TEXT,
          translation TEXT,
          urgency TEXT,
          location TEXT,
          confidence REAL
        );`,
        [],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const insertAlert = (alert: AlertEvent) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO alerts (timestamp, eventType, transcription, translation, urgency, location, confidence)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [alert.timestamp, alert.eventType, alert.transcription, alert.translation, alert.urgency, alert.location, alert.confidence],
        (_, result) => resolve(result.insertId || 0),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getAlerts = (limit = 50) => {
  return new Promise<AlertEvent[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM alerts ORDER BY timestamp DESC LIMIT ?`,
        [limit],
        (_, { rows: { _array } }) => resolve(_array as AlertEvent[]),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};
