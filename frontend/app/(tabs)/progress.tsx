import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { API_BASE_URL } from '@/config/constants';

const screenWidth = Dimensions.get("window").width;

export default function ProgressScreen() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ daily: 0, weekly: 0, lastWeek: 0, weeklyTrend: [] });
  const [error, setError] = useState<string | null>(null);


  const WEEKLY_GOAL = 10; // can be dynamic later

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/pomodoro_progress/progress`);
        const data = await res.json();
        setStats({
          daily: Number(data.daily) || 0,
          weekly: Number(data.weekly) || 0,
          lastWeek: Number(data.lastWeek) || 0,
          weeklyTrend: data.weeklyTrend || [],
        });
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError("Failed to load progress");
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#A87676" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  // Handle weekly change %
  let weeklyChange: number;
  if (!stats.lastWeek && !stats.weekly) {
    weeklyChange = 0;
  } else if (!stats.lastWeek) {
    weeklyChange = 100;
  } else {
    weeklyChange = Number(((stats.weekly - stats.lastWeek) / stats.lastWeek * 100).toFixed(1));
  }


  const progress = Math.min(stats.weekly / WEEKLY_GOAL, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Progress</Text>

      {/* Daily */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Daily Pomodoros</Text>
        <Text style={styles.value}>{stats.daily} completed</Text>
      </View>

      {/* Weekly */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Weekly Pomodoros</Text>
        <Text style={styles.value}>{stats.weekly} completed</Text>

        <ProgressBar progress={progress} color="#A87676" style={styles.progressBar} />
        <Text>{stats.weekly}/{WEEKLY_GOAL} weekly goal</Text>
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
  progressBar: { width: '100%', height: 10, borderRadius: 5, marginTop: 8, marginBottom: 4 }
});
