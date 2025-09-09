import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import * as Application from 'expo-application';
import { API_BASE_URL } from '@/config/constants';

import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { useBuddy } from '../../context/buddy-context';
import { Profile } from '@/types/profile';
import React from 'react';


export default function PomodoroScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mode, setMode] = useState<'studying' | 'short' | 'long'>('studying');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const { selectedBuddy, setSelectedBuddy, buddies } = useBuddy();

  // On the first load when opening the app, set the first pet in the list as selected pet
  useEffect(() => {
    if (!selectedBuddy && buddies?.length > 0) {
      setSelectedBuddy(buddies[0]);
    }
  }, [selectedBuddy, buddies]);

  // Fetch profile on mount
  useFocusEffect(
    React.useCallback(() => {
    const fetchProfile = async () => {
      let deviceId: string;

      if (Platform.OS === 'android') {
        deviceId = Application.getAndroidId() ?? 'unknown-device';
      } else {
        const iosId = await Application.getIosIdForVendorAsync();
        deviceId = iosId ?? 'unknown-device';
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/profile/${deviceId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);

          // initialize studying mode with profile values
          setTimeLeft((data.pomodoroMinutes ?? 25) * 60);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, []));

  // Build MODES dynamically based on profile
  const MODES = profile
    ? {
        studying: { label: 'Studying', time: profile.pomodoroMinutes * 60 },
        short: { label: 'Short Break', time: profile.shortBreakMinutes * 60 },
        long: { label: 'Long Break', time: profile.longBreakMinutes * 60 },
      }
    : {
        studying: { label: 'Studying', time: 25 * 60 },
        short: { label: 'Short Break', time: 5 * 60 },
        long: { label: 'Long Break', time: 15 * 60 },
      };

  const progress = ((MODES[mode].time - timeLeft) / MODES[mode].time) * 100;

  const logPomodoro = async (petId: number, taskName: string, durationMinutes: number) => {
    try {
      const body = {
        petId,
        taskName,
        durationMinutes,
        startTime: new Date().toISOString(),  // send current time
        endTime: new Date(new Date().getTime() + durationMinutes * 60000).toISOString(), // end time
      };

      const res = await fetch(`${API_BASE_URL}/api/pomodoro_logs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Pomodoro log saved:", data);
    } catch (err) {
      console.error("Failed to save pomodoro log:", err);
    }
  };


  // Play sound and vibrate
  const handleEnd = async () => {
    setIsRunning(false);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/alarm.mp3') 
    );
    await sound.playAsync();

    // Save log if current mode was studying
    if (mode === 'studying' && selectedBuddy) {
        await logPomodoro(
            selectedBuddy.id,
            "Study Session",
            MODES.studying.time / 60,
        );
    }

    // Auto-switch modes
    if (mode === 'studying') {
      setMode('short');
      setTimeLeft(MODES.short.time);
    } else {
      setMode('studying');
      setTimeLeft(MODES.studying.time);
    }
  };

  // Countdown effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            handleEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }

    return () => clearInterval(intervalRef.current!);
  }, [isRunning]);

  // When mode changes, reset timer
  useEffect(() => {
    setTimeLeft(MODES[mode].time);
  }, [mode]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <View style={styles.container}>
        <View style={styles.content}>
      {/* Mode Buttons */}
      <View style={styles.modeRow}>
        {Object.entries(MODES).map(([key, val]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.modeButton,
              mode === key && styles.modeButtonActive,
            ]}
            onPress={() => {
              setMode(key as 'studying' | 'short' | 'long');
              setIsRunning(false);
            }}
          >
            <Text style={styles.modeText}>{val.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quote box */}
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>{selectedBuddy?.quote}</Text>
      </View>


      {/* Dog Image */}

        <AnimatedCircularProgress
        size={250}
        width={12}
        fill={progress}
        tintColor="#FF8A8A"
        backgroundColor="#FFE5E5"
        duration={1000}
        >
        {() => (
            <Image
            source={{uri:selectedBuddy?.imageUrl}}
            style={styles.dogImage}
            />
        )}
        </AnimatedCircularProgress>


      {/* Timer Display */}
      <View style={styles.timerBox}>
        {formatTime(timeLeft).split('').map((char, idx) => (
          <View key={idx} style={styles.timerDigit}>
            <Text style={styles.timerText}>{char}</Text>
          </View>
        ))}
      </View>
      </View>

      {/* Start / Pause */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => setIsRunning((prev) => !prev)}
      >
        <Text style={styles.startText}>{isRunning ? 'Pause' : 'Start'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD0D0',
    alignItems: 'center',
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },

  modeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#E1ACAC',
  },
  modeButtonActive: {
    backgroundColor: '#A87676',
  },
  modeText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  messageBox: {
    backgroundColor: '#E1ACAC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  messageText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },

  dogCircle: {
    width: 230,
    height: 230,
    borderRadius: 120,
    backgroundColor: '#F5C6C6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dogImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },

  timerBox: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 40,
    paddingTop: 40,
  },
  timerDigit: {
    backgroundColor: '#E1ACAC',
    padding: 10,
    width: 70,
    height: 90,
    alignItems: 'center',
    borderRadius: 8,
  },
  timerText: {
    fontSize: 55,
    color: '#fff',
    fontWeight: 'bold',
  },

  startButton: {
      backgroundColor: "#A87676",
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 20,
  },
  startText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
