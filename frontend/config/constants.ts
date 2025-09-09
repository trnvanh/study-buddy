import { Platform } from "react-native";

let API_BASE_URL = "http://63.178.41.236:8080"; // default for iOS simulator

// For physical devices, replace with your machine’s LAN IP
// Example: "http://192.168.1.5:8080"
if (__DEV__) {
  // override in dev if needed
}

export { API_BASE_URL };
