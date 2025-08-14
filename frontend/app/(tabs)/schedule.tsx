import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

type Task = {
  id: number;
  title: string;
  time: string;
  due: string;
  done: boolean;
  day: string;
};

export default function SchedulingScreen() {
  const [tasks, setTasks] = useState<{ [day: string]: Task[] }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDay, setCurrentDay] = useState('');
  const [newTask, setNewTask] = useState({ title: '', time: '', due: '', day: '' });
  const [loading, setLoading] = useState(true);

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('http://10.0.2.2:8080/api/tasks');
        const data: Task[] = await res.json();

        // Group tasks by day
        const grouped: { [day: string]: Task[] } = {};
        data.forEach((task) => {
          if (!grouped[task.day]) grouped[task.day] = [];
          grouped[task.day].push(task);
        });

        setTasks(grouped);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const toggleDone = async (day: string, id: number) => {
    try {
      await fetch(`http://10.0.2.2:8080/api/tasks/${id}/toggle`, {
        method: 'PUT',
      });

      setTasks(prev => ({
        ...prev,
        [day]: prev[day].map(t => t.id === id ? { ...t, done: !t.done } : t),
      }));
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.time || !newTask.due || !currentDay) {
      Alert.alert('Fill all fields');
      return;
    }

    try {
      const res = await fetch('http://10.0.2.2:8080/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTask, day: currentDay, done: false }),
      });

      const savedTask: Task = await res.json();

      setTasks(prev => ({
        ...prev,
        [currentDay]: [...(prev[currentDay] || []), savedTask],
      }));

      setNewTask({ title: '', time: '', due: '', day: '' });
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const renderTask = (day: string, task: Task) => {
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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scheduling</Text>

      <FlatList
        data={Object.keys(tasks)}
        keyExtractor={(item) => item}
        renderItem={({ item: day }) => (
          <View>
            <Text style={styles.dayHeader}>{day}</Text>
            {tasks[day]?.map(task => renderTask(day, task))}
            <TouchableOpacity
              style={styles.addTaskBtn}
              onPress={() => {
                setCurrentDay(day);
                setModalVisible(true);
              }}
            >
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
    title: { fontSize: 35, fontFamily: 'Jersey20', color: '#A87676', marginBottom: 20 },

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
