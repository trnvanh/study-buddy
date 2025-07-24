import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

import { useBuddy } from '../../context/buddy-context';
import { useRouter } from 'expo-router';


const screenWidth = Dimensions.get('window').width;
const circleSize = (screenWidth - 100) / 3; // 3 per row, with padding

const buddies = [
  { id: 1, name: 'Shiba', image: require('../../assets/images/shiba.png') },
  { id: 2, name: 'Husky', image: require('../../assets/images/husky.png') },
  { id: 3, name: 'Shiba2', image: require('../../assets/images/shiba2.png') },
  { id: 4, name: 'Shiba3', image: require('../../assets/images/shiba3.jpg') },
];

export default function BuddyScreen() {
  const { selectedBuddy, setSelectedBuddy } = useBuddy();
  const router = useRouter();

  const displayBuddy = selectedBuddy || buddies[0]; // this one needs to be fixed later after saving the data somewhere else

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Choose your buddy</Text>

        {/* Big selected buddy */}
        <View style={styles.bigCircle}>
          <Image source={displayBuddy.image} style={styles.bigImage} />
          <Text style={styles.buddyName}>{displayBuddy.name}</Text>
        </View>

        {/* Buddy Grid */}
        <View style={styles.buddyGrid}>
          {buddies.map((buddy) => (
            <TouchableOpacity
              key={buddy.id}
              style={[
                styles.buddyCircle,
                displayBuddy.id === buddy.id && styles.selectedBorder,
              ]}
              onPress={() => setSelectedBuddy(buddy)}
            >
              <Image source={buddy.image} style={styles.buddyImage} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={() => {
        if (selectedBuddy) router.push('/pomodoro'); // adjust route if needed
      }}>
        <Text style={styles.startText}>Start</Text>
      </TouchableOpacity>
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
    width: 150,
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginLeft: 170,
  },
  startText: { fontSize: 18, color: 'white', fontWeight: 'bold' },
});
