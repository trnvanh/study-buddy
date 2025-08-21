import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function ProfileScreen() {
  const [shortTermGoals, setShortTermGoals] = useState('');
  const [longTermGoals, setLongTermGoals] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      {/* Avatar Row */}
      <View style={styles.avatarRow}>
        <Image
          source={require('../../assets/images/shiba.png')} // use your buddy image here
          style={styles.avatar}
        />
        <View style={styles.squareBox}>
          <Text>Information</Text>
        </View>
      </View>

      {/* Short-Term Goals */}
      <Text style={styles.label}>My short term goals...</Text>
      <TextInput
        placeholder="Write your short term goals"
        placeholderTextColor="#DDA8A8"
        multiline
        style={styles.inputBox}
        value={shortTermGoals}
        onChangeText={setShortTermGoals}
      />

      {/* Long-Term Goals */}
      <Text style={styles.label}>My long term goals...</Text>
      <TextInput
        placeholder="Write your long term goals"
        placeholderTextColor="#DDA8A8"
        multiline
        style={styles.inputBox}
        value={longTermGoals}
        onChangeText={setLongTermGoals}
      />
    </View>
  );
}

const boxSize = screenWidth * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD0D0',
    padding: 20,
  },
  header: {
    fontSize: 64,
    fontWeight: 'bold',
    fontFamily: 'Jersey20',
    color: '#A87676',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: boxSize,
    height: boxSize,
    borderRadius: boxSize / 2,
    backgroundColor: '#F0BABA',
  },
  squareBox: {
    width: boxSize,
    height: boxSize,
    backgroundColor: '#E1ACAC',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionCount: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  sessionLabel: {
    fontSize: 14,
    color: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#A87676',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  inputBox: {
    backgroundColor: '#F5C6C6',
    borderRadius: 10,
    height: 100,
    padding: 10,
    marginBottom: 20,
    color: '#6D4C4C',
    fontSize: 15,
    textAlignVertical: 'top',
  },
});
