import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, Modal, Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { API_BASE_URL } from '@/config/constants';
import { Task } from '@/types/task';

export default function SchedulingScreen() {
  const [tasks, setTasks] = useState<{ [day: string]: Task[] }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', duration: 0 });
  const [taskTime, setTaskTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/tasks`);
        const json = await res.json();
        const data: any[] = Array.isArray(json) ? json : json.tasks ?? [];

        // Convert string → Date
        const tasksWithDates: Task[] = data
            .filter(task => !task.done)
            .map(task => ({
              ...task,
              time: new Date(task.time),
            }));

        // Sort by start time
        tasksWithDates.sort((a, b) => a.time.getTime() - b.time.getTime());

        // Group by weekday
        const grouped: { [day: string]: Task[] } = {};
        tasksWithDates.forEach((task) => {
          const dayKey = task.time.toLocaleDateString('en-US', { weekday: 'long' });
          if (!grouped[dayKey]) grouped[dayKey] = [];
          grouped[dayKey].push(task);
        });

        setTasks(grouped);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Toggle done
  const toggleDone = async (day: string, id: number) => {
    try {
      await fetch(`${API_BASE_URL}/api/tasks/${id}/toggle`, {
        method: 'PUT',
      });

       // Cross out immediately
       setTasks(prev => ({
            ...prev,
            [day]: prev[day].map(t =>
              t.id === id ? { ...t, done: !t.done } : t
            ),
       }));

       // Transition removing it after delay
       setTimeout(() => {
            setTasks(prev => ({
              ...prev,
              [day]: prev[day].filter(t => t.id !== id),
            }));
       }, 800);
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  // Save task when adding or modifying task
  const handleSaveTask = async () => {
    if (!newTask.title || !taskTime || !newTask.duration) {
      Alert.alert('Fill all fields');
      return;
    }

    try {
      const formattedTime = taskTime.toISOString();
      const taskDayKey = taskTime.toLocaleDateString('en-US', { weekday: 'long' });

      if (editingTask) {
        // Update existing task
        const res = await fetch(`${API_BASE_URL}/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...editingTask,
            title: newTask.title,
            time: formattedTime,
            duration: newTask.duration,
          }),
        });

        const updated = await res.json();
        const updatedTask: Task = { ...updated, time: new Date(updated.time) };

        setTasks(prev => {
          const updatedTasks = { ...prev };
          // Remove task from old day group (in case user changed time/day)
          for (const key in updatedTasks) {
            updatedTasks[key] = updatedTasks[key].filter(t => t.id !== editingTask.id);
          }
          // Add task into new day group
          if (!updatedTasks[taskDayKey]) updatedTasks[taskDayKey] = [];
          updatedTasks[taskDayKey].push(updatedTask);

          // Sort tasks in the group
          updatedTasks[taskDayKey].sort((a, b) => a.time.getTime() - b.time.getTime());

          return updatedTasks;
        });
      } else {
        // Create new task
        const res = await fetch(`${API_BASE_URL}/api/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newTask.title,
            time: formattedTime,
            duration: newTask.duration,
            done: false,
          }),
        });

        const saved = await res.json();
        const savedTask: Task = { ...saved, time: new Date(saved.time) };

        setTasks(prev => ({
          ...prev,
          [taskDayKey]: [...(prev[taskDayKey] || []), savedTask],
        }));
      }

      // Reset after save
      setNewTask({ title: '', duration: 0 });
      setTaskTime(null);
      setEditingTask(null);
      setModalVisible(false);
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };


  // Render task card
  const renderTask = (day: string, task: Task) => (
    <View key={task.id} style={styles.taskCard}>
      <TouchableOpacity onPress={() => toggleDone(day, task.id)}>
        <Ionicons name={task.done ? 'checkbox' : 'square-outline'} size={24} color="#555" />
      </TouchableOpacity>
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text style={{ fontWeight: 'bold' }}>
          {task.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {" • "}{task.duration} min
        </Text>
        <Text style={{ textDecorationLine: task.done ? 'line-through' : 'none' }}>
          {task.title}
        </Text>
      </View>
      <TouchableOpacity style={{ marginLeft: 6 }} onPress={() => {
        setEditingTask(task);
        setNewTask({title: task.title, duration: task.duration});
        setTaskTime(task.time);
        setModalVisible(true);
      }}>
        <MaterialIcons name="edit" size={20} color="#444" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading schedule...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scheduling</Text>

      {tasks && Object.keys(tasks).length > 0? (
        <FlatList
          data={Object.keys(tasks)}
          keyExtractor={(item) => item}
          renderItem={({ item: day }) => (
            <View>
              <Text style={styles.dayHeader}>{day}</Text>
              {tasks[day]?.map(task => renderTask(day, task))}
              <TouchableOpacity
                style={styles.addTaskBtn}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.plus}>＋</Text>
              </TouchableOpacity>
            </View>
            )}
          />
        ) : (
            <View style={{alignItems: "center", marginTop: 40}}>
              <Text>
                Start to add tasks now.
              </Text>
              <TouchableOpacity style={styles.addTaskBtn} onPress={() => setModalVisible(true)}>
                <Text style={styles.plus}>Add task</Text>
              </TouchableOpacity>
            </View>
        )
      }

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
              Add New Schedule
            </Text>

            {/* Title */}
            <TextInput
              placeholder="Task Title"
              value={newTask.title}
              onChangeText={text => setNewTask({ ...newTask, title: text })}
              style={styles.input}
            />

            {/* Time */}
            <TouchableOpacity
              style={[styles.input, { justifyContent: 'center' }]}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={{ color: taskTime ? '#000' : '#999' }}>
                {taskTime
                  ? taskTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'Select time'}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={taskTime || new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowTimePicker(false);
                  if (selectedDate) setTaskTime(selectedDate);
                }}
              />
            )}

            {/* Duration */}
            <TextInput
              placeholder="Duration (minutes)"
              value={newTask.duration ? String(newTask.duration) : ''}
              keyboardType="numeric"
              onChangeText={text =>
                setNewTask({ ...newTask, duration: Number(text) || 0 })
              }
              style={styles.input}
            />

            {/* Save */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveTask}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{editingTask ? 'Update Task' : 'Save Schedule'}</Text>
            </TouchableOpacity>

            {/* Cancel */}
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
  title: { fontSize: 35, fontFamily: 'Jersey20', color: '#A87676', marginBottom: 10, paddingHorizontal: 110 },
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
