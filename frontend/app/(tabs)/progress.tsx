import { API_BASE_URL } from '@/config/constants';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Profile } from '@/types/profile';
import { StatsResponse } from '@/types/stats';
import { useFocusEffect } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import * as Progress from 'react-native-progress';

const screenWidth = Dimensions.get('window').width;

export default function ProgressScreen() {
  const [stats, setStats] = useState(null as StatsResponse | null);
  const [profile, setProfile] = useState(null as Profile | null);
  const [loading, setLoading] = useState(true);

  // Theme colors (call hooks unconditionally to follow Rules of Hooks)
  const bg = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const accent = useThemeColor({}, 'accent');
  const text = useThemeColor({}, 'text');

  // Fetch profile once on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Avoid expo-application API for now; use unknown-device fallback
        const deviceId = 'unknown-device';
        const res = await fetch(`${API_BASE_URL}/api/profile/${deviceId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, []);

  // Fetch stats when screen focused
  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;
      setLoading(true);

      fetch(`${API_BASE_URL}/api/stats/progress`)
        .then((res) => res.json())
        .then((data) => {
          if (mounted) {
            setStats(data);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch stats:', err);
          if (mounted) setLoading(false);
        });

      return () => {
        mounted = false;
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: bg }]}> 
        <ActivityIndicator size="large" color={accent} />
      </View>
    );
  }

  if (!stats) {
    return <Text style={styles.errorText}>No stats available.</Text>;
  }

  const WEEKLY_GOAL = profile?.goalPerWeek ?? 10;

  // Handle weekly change % safely
  let weeklyChange = 0;
  if (typeof stats.lastWeekCount === 'number' && typeof stats.weeklyCount === 'number') {
    if (stats.lastWeekCount === 0) {
      weeklyChange = stats.weeklyCount === 0 ? 0 : 100;
    } else {
      weeklyChange = Number(((stats.weeklyCount - stats.lastWeekCount) / stats.lastWeekCount * 100).toFixed(1));
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}> 
      <Text style={[styles.title, { color: text }]}>Progress</Text>

      <View style={styles.row}>
        {/* Daily */}
        <View style={[styles.card, { backgroundColor: card }] }>
          <Text style={[styles.subtitle, {color: text}]}>Daily Progress</Text>
          <Text style={styles.value}>{stats.dailyCount} sessions</Text>
          <Text style={styles.value}>3 hours</Text> {/* Hardcoded for now */}
        </View>

        {/* Weekly */}
        <View style={[styles.card, { backgroundColor: card }] }>
          <Text style={[styles.subtitle, {color: text}]}>Weekly Progress</Text>
          <Text style={styles.value}>{stats.weeklyCount}/{WEEKLY_GOAL} sessions</Text>

          <Progress.Bar
            progress={Math.min(1, (stats.weeklyCount ?? 0) / (WEEKLY_GOAL || 1))}
            width={120}
            height={10}
            color={accent}
            unfilledColor={bg}
            borderWidth={0}
            borderRadius={5}
            style={{ marginTop: 8 }}
          />
        </View>
      </View>

      {/* Weekly comparison */}
      <View style={[styles.cardWeeklyComparison, { backgroundColor: card }]}>
        <Text style={[styles.subtitle, {color: text}]}>Comparison vs Last Week</Text>
        <Text style={[styles.percentage, { color: weeklyChange >= 0 ? 'green' : 'red' }]}>
          {weeklyChange >= 0 ? '+' : ''}{weeklyChange}%
        </Text>
        <Text>+ {(stats.weeklyCount ?? 0) - (stats.lastWeekCount ?? 0)} sessions</Text>
      </View>

      {/* Weekly Trend Chart */}
      {stats.weeklyTrend && stats.weeklyTrend.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.subtitle, {color: text}]}>Weekly Trend</Text>
          <LineChart
            data={{
              labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
              datasets: [{ data: stats.weeklyTrend }]
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: card as any,
              backgroundGradientTo: card as any,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(168, 118, 118, ${opacity})`,
              labelColor: () => '#333',
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#A87676'
              }
            }}
            bezier
            style={{ borderRadius: 16, marginVertical: 10 }}
          />
        </View>
      )}

      {/* Unlocking new pets indicator */}
      <View style={styles.section}>
        <Text style={[styles.subtitle, {color: text}]}>Unlock New Buddy</Text>

        <View style={{ width: 250, height: 40, justifyContent: 'center' }}>
          <Progress.Bar
            progress={Math.min(1, ((stats.totalHours ?? 0) / 10))}
            width={250}
            height={10}
            color={accent}
            unfilledColor={card}
            borderWidth={0}
            borderRadius={5}
          />

          <Animated.View
            style={{
              position: 'absolute',
              left: Math.max(0, ((stats.totalHours ?? 0) / 10) * 250 - 20),
              top: -15,
            }}
          >
            <ExpoImage
              source={require('../../assets/images/running_dog.gif')}
              style={{ width: 50, height: 50 }}
              contentFit="contain"
              autoplay
            />
          </Animated.View>
        </View>

        <Text style={{ marginTop: 5 }}>{stats.totalHours ?? 0} / 10 hours</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFD0D0', 
    alignItems: 'center', 
    paddingTop: 60 
  },
  title: { 
    fontSize: 35, 
    fontFamily: 'Jersey20', 
    color: '#A87676', 
    marginBottom: 20 
  },
  section: { 
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center', 
    width: '90%' 
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#555',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
    marginHorizontal: 10,
    padding: 16,
    height: 150,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardWeeklyComparison: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      opacity: 0.8,
      marginVertical: 20,
      padding: 16,
      width: '90%',
      height: 150,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#A87676',
    marginBottom: 15,
  },
  value: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 4,
  },
  percentage: {
      fontSize: 25,
      fontWeight: 'bold',
      color: '#444',
      marginTop: 4,
   },
});
