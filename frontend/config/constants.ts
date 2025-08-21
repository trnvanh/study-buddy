import { Platform } from "react-native";

let API_BASE_URL = "http://localhost:8080"; // default for iOS simulator

if (Platform.OS === "android") {
  API_BASE_URL = "http://10.0.2.2:8080"; // Android emulator localhost
}

// For physical devices, replace with your machine’s LAN IP
// Example: "http://192.168.1.5:8080"
if (__DEV__) {
  // override in dev if needed
}

export { API_BASE_URL };
