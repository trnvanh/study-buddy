// app/(tabs)/scheduling.tsx
import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const initialTasks = {
  'Mon 16 Sep': [
    { id: 1, time: '9 am - 10 am', title: 'Organic Chemistry HW', due: '18 Sep at 23:59', done: false },
    { id: 2, time: '12 am - 1 am', title: 'Report Software course', due: '24 Sep at 23:59', done: false },
    { id: 3, time: '6 pm - 10 pm', title: 'Matrix Analysis HW', due: '20 Sep at 23:59', done: false },
  ],
  'Tue 17 Sep': [
    { id: 4, time: '8 am - 10 am', title: 'Organic Chemistry HW', due: '18 Sep at 23:59', done: false },
    { id: 5, time: '12 am - 1 am', title: 'Report Software course', due: '24 Sep at 23:59', done: false },
    { id: 6, time: '8 pm - 10 pm', title: 'Matrix Analysis HW', due: '20 Sep at 23:59', done: false },
  ],
};

export default function SchedulingScreen() {
  const [tasks, setTasks] = useState(initialTasks);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDay, setCurrentDay] = useState('Mon 16 Sep');
  const [newTask, setNewTask] = useState({ title: '', time: '', due: '' });

  const toggleDone = (day: string, id: number) => {
    setTasks(prev => ({
      ...prev,
      [day]: prev[day].map(t => t.id === id ? { ...t, done: !t.done } : t),
    }));
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.time || !newTask.due) {
      Alert.alert('Fill all fields');
      return;
    }
    setTasks(prev => ({
      ...prev,
      [currentDay]: [
        ...(prev[currentDay] || []),
        { id: Date.now(), title: newTask.title, time: newTask.time, due: newTask.due, done: false },
      ],
    }));
    setNewTask({ title: '', time: '', due: '' });
    setModalVisible(false);
  };

  const renderTask = (day: string, task: any) => {
    const dueColor = task.due.includes('18') ? '#ff5f5f' : '#ffd15c';

    return (
      <View key={task.id} style={styles.taskCard}>
        <TouchableOpacity onPress={() => toggleDone(day, task.id)}>
          <Ionicons name={task.done ? 'checkbox' : 'square-outline'} size={24} color="#555" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>{task.time}</Text>
          <Text style={{ textDecorationLine: task.done ? 'line-through' : 'none' }}>{task.title}</Text>
        </View>
        <View style={[styles.dueTag, { backgroundColor: dueColor }]}>
          <Text style={{ fontSize: 10, color: 'white' }}>{task.due}</Text>
        </View>
        <TouchableOpacity style={{ marginLeft: 6 }}>
          <MaterialIcons name="edit" size={20} color="#444" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scheduling</Text>

      {/* Week Selector */}
      <View style={styles.weekRow}>
        <Text style={styles.weekLabel}>Week</Text>
        <TextInput style={styles.weekInput} placeholder="16 Sep" />
        <Ionicons name="calendar-outline" size={20} color="#444" style={{ marginLeft: 8 }} />
      </View>

      <FlatList
        data={Object.keys(tasks)}
        keyExtractor={(item) => item}
        renderItem={({ item: day }) => (
          <View>
            <Text style={styles.dayHeader}>{day}</Text>
            {tasks[day].map(task => renderTask(day, task))}
            <TouchableOpacity style={styles.addTaskBtn} onPress={() => {
              setCurrentDay(day);
              setModalVisible(true);
            }}>
              <Text style={styles.plus}>＋</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Add Task Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>Add New Task</Text>
            <TextInput placeholder="Task Title" value={newTask.title} onChangeText={text => setNewTask({ ...newTask, title: text })} style={styles.input} />
            <TextInput placeholder="Time (e.g. 1 pm - 2 pm)" value={newTask.time} onChangeText={text => setNewTask({ ...newTask, time: text })} style={styles.input} />
            <TextInput placeholder="Due (e.g. 24 Sep at 23:59)" value={newTask.due} onChangeText={text => setNewTask({ ...newTask, due: text })} style={styles.input} />
            <TouchableOpacity style={styles.saveBtn} onPress={handleAddTask}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save Task</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: '#999' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD0D0',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Jersey20',
    color: '#A87676',
    marginBottom: 20,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  weekLabel: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  weekInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  dayHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  dueTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  addTaskBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
    padding: 4,
  },
  plus: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: '#A87676',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
