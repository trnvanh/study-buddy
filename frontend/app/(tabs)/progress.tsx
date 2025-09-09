import { useEffect, useState } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import * as Progress from "react-native-progress";
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { API_BASE_URL } from '@/config/constants';
import { StatsResponse } from '@/types/stats';
import { Profile } from '@/types/profile';
import * as Application from 'expo-application';
import React from 'react';

const screenWidth = Dimensions.get("window").width;

export default function ProgressScreen() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Fetch profile to get weekly goal
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
          }
        } catch (err) {
          console.error('Failed to fetch profile:', err);
        }
      };
  
      fetchProfile();
  }, []));

  const WEEKLY_GOAL = profile? profile.goalPerWeek : 10;

  useFocusEffect(
    React.useCallback(() => {
    fetch(`${API_BASE_URL}/api/stats/progress`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch stats:", err);
        setLoading(false);
      });
  }, []));

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#A87676" />
      </View>
    );
  }

  if (!stats) {
    return <Text style={styles.errorText}>No stats available.</Text>;
  }

  // Handle weekly change %
  let weeklyChange: number;
  if (!stats.lastWeekCount && !stats.weeklyCount) {
    weeklyChange = 0;
  } else if (!stats.lastWeekCount) {
    weeklyChange = 100;
  } else {
    weeklyChange = Number(((stats.weeklyCount - stats.lastWeekCount) / stats.lastWeekCount * 100).toFixed(1));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress</Text>

      <View style={styles.row}>
        {/* Daily */}
        <View style={styles.card}>
          <Text style={styles.subtitle}>Daily Progress</Text>
          <Text style={styles.value}>{stats.dailyCount} sessions completed</Text>
          <Text style={styles.value}>3 hours completed</Text> {/* Hardcoded for now, modify when complete updated stats service in backend */}
        </View>

        {/* Weekly */}
        <View style={styles.card}>
          <Text style={styles.subtitle}>Weekly Progress</Text>
          <Text style={styles.value}>{stats.weeklyCount}/{WEEKLY_GOAL} sessions</Text>

          <Progress.Bar
            progress={stats.weeklyCount / WEEKLY_GOAL}
            width={120}
            height={10}
            color="#A87676"
            unfilledColor="#FFD0D0"
            borderWidth={0}
            borderRadius={5}
            style={{ marginTop: 8 }}
          />
        </View>
      </View>

      {/* Weekly comparison */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Comparison vs Last Week</Text>
        <Text style={[styles.value, { color: weeklyChange >= 0 ? 'green' : 'red' }]}>
          {weeklyChange >= 0 ? '+' : ''}{weeklyChange}%
        </Text>
        <Text>+ {stats.weeklyCount - stats.lastWeekCount} sessions</Text>
      </View>

      {/* Weekly Trend Chart */}
      {stats.weeklyTrend && stats.weeklyTrend.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Weekly Trend</Text>
          <LineChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [{ data: stats.weeklyTrend }]
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: "#FADADD",
              backgroundGradientTo: "#FADADD",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(168, 118, 118, ${opacity})`,
              labelColor: () => "#333",
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#A87676"
              }
            }}
            bezier
            style={{
              borderRadius: 16,
              marginVertical: 10
            }}
          />
        </View>
      )}
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
    marginTop: 30,
    marginBottom: 20, 
    alignItems: 'center', 
    width: '90%' 
  },
  errorText: {
    textAlign: "center",
    marginTop: 50,
    color: "#555",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "#E1ACAC",
    opacity: 0.75,
    marginHorizontal: 5,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#A87676",
    marginBottom: 15,
  },
  value: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#444",
    marginTop: 4,
  },
});
