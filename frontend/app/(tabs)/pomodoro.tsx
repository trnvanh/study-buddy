import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { useBuddy } from '../../context/buddy-context';

const MODES = {
  studying: { label: 'Studying', time: 45 * 60 },
  short: { label: 'Short Break', time: 5 * 60 },
  long: { label: 'Long Break', time: 15 * 60 },
};

export default function PomodoroScreen() {
  const [mode, setMode] = useState<'studying' | 'short' | 'long'>('studying');
  const [timeLeft, setTimeLeft] = useState(MODES.studying.time);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const { selectedBuddy } = useBuddy();

  const progress = ((MODES.studying.time - timeLeft) / MODES.studying.time) * 100;

  // Play sound and vibrate
  const handleEnd = async () => {
    setIsRunning(false);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/alarm.mp3') 
    );
    await sound.playAsync();

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
        <Text style={styles.messageText}>I’m watching you hooman. Better be studying.</Text>
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
            source={selectedBuddy?.image}
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
    backgroundColor: '#E1ACAC',
    width: 155,
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginLeft: 20,
  },
  startText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
