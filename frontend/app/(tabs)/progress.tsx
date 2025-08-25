import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { API_BASE_URL } from '@/config/constants';
import { StatsResponse } from '@/types/stats';

const screenWidth = Dimensions.get("window").width;

export default function ProgressScreen() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsResponse | null>(null);

  const WEEKLY_GOAL = 10; // can be dynamic later when build user info 

  useEffect(() => {
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
  }, []);

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


  const progress = Math.min(stats.weeklyCount / WEEKLY_GOAL, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress</Text>

      {/* Daily */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Daily Pomodoros</Text>
        <Text style={styles.value}>{stats.dailyCount} completed</Text>
      </View>

      {/* Weekly */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Weekly Pomodoros</Text>
        <Text style={styles.value}>{stats.weeklyCount} completed</Text>

        <ProgressBar progress={progress} color="#A87676" style={styles.progressBar} />
        <Text>{stats.weeklyCount}/{WEEKLY_GOAL} weekly goal</Text>
      </View>

      {/* Weekly comparison */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Comparison vs Last Week</Text>
        <Text style={[styles.value, { color: weeklyChange >= 0 ? 'green' : 'red' }]}>
          {weeklyChange >= 0 ? '+' : ''}{weeklyChange}%
        </Text>
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
  container: { flex: 1, backgroundColor: '#FFD0D0', alignItems: 'center', paddingTop: 60 },
  title: { fontSize: 35, fontFamily: 'Jersey20', color: '#A87676', marginBottom: 20 },
  section: { marginBottom: 30, alignItems: 'center', width: '90%' },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: "#5C3D3D" },
  value: { fontSize: 20, fontWeight: 'bold' },
  progressBar: { width: '100%', height: 10, borderRadius: 5, marginTop: 8, marginBottom: 4 },
  errorText: {
    textAlign: "center",
    marginTop: 50,
    color: "#555",
  },
});
