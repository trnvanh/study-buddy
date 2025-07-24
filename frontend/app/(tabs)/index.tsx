import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}><Text style={styles.title}>Study Buddy</Text></View>
      <View style={styles.taglineContainer}><Text style={styles.tagline}>Let a cute buddy go with you on your study journey.</Text></View>

      <Link href="../buddy" asChild>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Start Studying</Text></TouchableOpacity>
      </Link>
      <Link href="../profile" asChild>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>My Profile</Text></TouchableOpacity>
      </Link>
      <Link href="../schedule" asChild>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Scheduling</Text></TouchableOpacity>
      </Link>
      <Link href="../progress" asChild>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Progress</Text></TouchableOpacity>
      </Link>

      <TouchableOpacity style={styles.secondaryBtn}>
        <Text style={styles.secondaryText}>Where Buddies?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFD0D0', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  titleContainer: { 
    backgroundColor: '#E1ACAC', 
    width: 157,
    height: 157,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 40,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { 
    fontSize: 40, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    fontFamily: 'Joan',
    color: '#FFD0D0',
  },
  taglineContainer: { 
    backgroundColor: '#A87676', 
    width: 260,
    height: 75,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  tagline: { 
    fontSize: 20, 
    color: '#E1ACAC', 
    marginBottom: 10, 
    textAlign: 'center', 
    fontFamily: 'Joan',
  },
  button: {
    backgroundColor: '#E1ACAC',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginVertical: 10,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: { 
    fontSize: 25, 
    fontFamily: 'Jersey20',
    color: '#A87676' 
  },
  secondaryBtn: { 
    marginTop: 30 
  },
  secondaryText: { 
    color: '#a76c8a', 
    fontSize: 16, 
    textDecorationLine: 'underline' 
  },
});
