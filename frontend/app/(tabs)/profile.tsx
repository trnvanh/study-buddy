import { useEffect, useState } from "react";
import { View, Text, Switch, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import * as Application from "expo-application";
import { API_BASE_URL } from "@/config/constants";
import { Profile } from "@/types/profile";
import * as ImagePicker from "expo-image-picker";
import { Image, Alert } from "react-native";


export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load profile on mount
  useEffect(() => {
    const initProfile = async () => {
      let deviceId: string;

      if (Platform.OS === "android") {
        deviceId = Application.getAndroidId() ?? "unknown-device";
      } else {
        const iosId = await Application.getIosIdForVendorAsync();
        deviceId = iosId ?? "unknown-device";
      }

      try {
        // 1. Try fetching existing profile
        const res = await fetch(`${API_BASE_URL}/api/profile/${deviceId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          // 2. If not found, create new one
          const defaultProfile: Profile = {
            deviceId,
            pomodoroMinutes: 25,
            shortBreakMinutes: 5,
            longBreakMinutes: 15,
            goalPerWeek: 4,
            theme: "pink",
            darkMode: false,
            shortTermGoal: "",
            longTermGoal: "",
            avatarUrl: "",
          };

          const createRes = await fetch(`${API_BASE_URL}/api/profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(defaultProfile),
          });

          const saved = await createRes.json();
          setProfile(saved);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    initProfile(); 
  }, []);

  const pickAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "We need access to your gallery to set a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      setAvatar(localUri); // show immediately

      try {
        const formData = new FormData();
        const filename = localUri.split("/").pop() || "avatar.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        formData.append("avatar", { uri: localUri, name: filename, type } as any);

        const res = await fetch(`${API_BASE_URL}/api/profile/${profile?.deviceId}/avatar`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        const updatedProfile = await res.json();
        setAvatar(`${API_BASE_URL.replace("/api/profile", "")}${updatedProfile.avatarUrl}`);
      } catch (err) {
        console.error(err);
        Alert.alert("Upload failed", "Could not upload avatar");
      }
    }
  };

  // Save changes
  const saveProfile = async () => {
    if (!profile) return;
    try {
      await fetch(`${API_BASE_URL}/api/profile/${profile.deviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      alert("Profile saved!");
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  if (loading || !profile) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        {/* Avatar */}
        {avatar || profile?.avatarUrl ? (
          <Image
            source={{ uri: avatar || `${API_BASE_URL.replace("/api/profile", "")}${profile?.avatarUrl}` }}
            style={{ width: 120, height: 120, borderRadius: 60 }}
          />
        ) : (
          <Image
            source={require("../../assets/images/avatar.png")}
            style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: "#FFFFFF" }}
          />
        )}

        {/* Short Term Goal Box */}
        <View
          style={{
            flex: 1, 
            marginLeft: 16,
            padding: 10,
            backgroundColor: "#FFE5E5",
            borderRadius: 8,
          }}
        >
          <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Short-Term Goal</Text>
          <TextInput
            style={styles.input}
            value={profile.shortTermGoal}
            onChangeText={(text) => setProfile({ ...profile, shortTermGoal: text })}
          />
        </View>
      </View>

      <TouchableOpacity onPress={pickAvatar} style={{ marginBottom: 20 }}>
          <Text style={{ color: "#A87676", fontWeight: "bold" }}>Change Avatar</Text>
      </TouchableOpacity>

      <Text>Pomodoro Minutes</Text>
      <TextInput
        style={styles.input}
        value={String(profile.pomodoroMinutes)}
        keyboardType="numeric"
        onChangeText={(text) => setProfile({ ...profile, pomodoroMinutes: Number(text) || 0 })}
      />

      <Text>Short Break Minutes</Text>
      <TextInput
        style={styles.input}
        value={String(profile.shortBreakMinutes)}
        keyboardType="numeric"
        onChangeText={(text) => setProfile({ ...profile, shortBreakMinutes: Number(text) || 0 })}
      />

      <Text>Long Break Minutes</Text>
      <TextInput
        style={styles.input}
        value={String(profile.longBreakMinutes)}
        keyboardType="numeric"
        onChangeText={(text) => setProfile({ ...profile, longBreakMinutes: Number(text) || 0 })}
      />

      <Text>Goal Per Week</Text>
      <TextInput
        style={styles.input}
        value={String(profile.goalPerWeek)}
        keyboardType="numeric"
        onChangeText={(text) => setProfile({ ...profile, goalPerWeek: Number(text) || 0 })}
      />

      <Text>Long-Term Goal</Text>
      <TextInput
        style={styles.input}
        value={profile.longTermGoal}
        onChangeText={(text) => setProfile({ ...profile, longTermGoal: text })}
      />

      <View style={styles.row}>
        <Text>Dark Mode</Text>
        <Switch
          value={profile.darkMode}
          onValueChange={(val) => setProfile({ ...profile, darkMode: val })}
        />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFD0D0", padding: 20, paddingTop: 60 },
  title: { fontSize: 35, fontFamily: 'Jersey20', color: '#A87676', marginBottom: 10, paddingHorizontal: 135 },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  saveBtn: {
    backgroundColor: "#A87676",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
});
