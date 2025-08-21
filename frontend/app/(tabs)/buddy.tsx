import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { useBuddy } from '../../context/buddy-context';
import { Pet } from '../../types/pet';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '@/config/constants';

const screenWidth = Dimensions.get('window').width;
const circleSize = (screenWidth - 100) / 3;

export default function BuddyScreen() {
  const { selectedBuddy, setSelectedBuddy } = useBuddy();
  const router = useRouter();

  const [buddies, setBuddies] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch from backend
  useEffect(() => {
    console.log("Fetching buddies...");
    const fetchBuddies = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/pets`);
        if (res.ok) {
          const data = await res.json();
          const unlockedBuddies = data.filter((pet: Pet) => pet.unlocked);
          setBuddies(unlockedBuddies);
          if (unlockedBuddies.length > 0) setSelectedBuddy(unlockedBuddies[0]);
        } else {
          console.log('Fetch error status:', res.status);
        }
      } catch (error) {
        console.error('Failed to fetch pets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuddies();
  }, []);

  const displayBuddy = selectedBuddy;

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#A87676" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Choose your buddy</Text>

        {displayBuddy && (
          <View style={styles.bigCircle}>
            <Image source={{ uri: displayBuddy.imageUrl }} style={styles.bigImage} />
            <Text style={styles.buddyName}>{displayBuddy.name}</Text>
          </View>
        )}

        <View style={styles.buddyGrid}>
          {buddies.map((buddy) => (
            <TouchableOpacity
              key={buddy.id}
              style={[
                styles.buddyCircle,
                displayBuddy?.id === buddy.id && styles.selectedBorder,
              ]}
              onPress={() => setSelectedBuddy(buddy)}
            >
              <Image source={{ uri: buddy.imageUrl }} style={styles.buddyImage} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD0D0',
    paddingHorizontal: 10,
    paddingBottom: 30, 
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },

  title: { fontSize: 35, fontFamily: 'Jersey20', color: '#A87676', marginBottom: 20 },

  bigCircle: {
    width: 186,
    height: 186,
    borderRadius: 93,
    backgroundColor: '#E1ACAC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  bigImage: { width: 100, height: 100, resizeMode: 'contain' },
  buddyName: { marginTop: 6, fontSize: 16, fontWeight: '600' },

  buddyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  buddyCircle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  buddyImage: {
    width: circleSize * 0.6,
    height: circleSize * 0.6,
    resizeMode: 'contain',
  },
  selectedBorder: {
    borderWidth: 3,
    borderColor: '#f7b7c2',
  },

  startButton: {
    backgroundColor: '#E1ACAC',
    width: 125,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginLeft: 140,
  },
  startText: { fontSize: 18, color: 'white', fontWeight: 'bold' },
});