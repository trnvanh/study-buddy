import { View, Text, StyleSheet } from 'react-native';

export default function ProgressScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress</Text>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Daily Progress</Text>
        <Text>2h / 5h</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Weekly Progress</Text>
        <Text>22h / 35h</Text>
      </View>
      <Text style={{ marginTop: 40, fontStyle: 'italic' }}>You rocked today!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FADADD', alignItems: 'center', paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 30, alignItems: 'center' },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
});
