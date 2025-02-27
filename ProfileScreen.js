import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Image, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        if (token) {
          const decoded = jwtDecode(token);
          setName(decoded.name);
          setEmail(decoded.email);
        }
      } catch (error) {
        console.error("Error decoding token", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("jwtToken");
    } catch (error) {
      console.error("Error removing token", error);
    }
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://avatar.iran.liara.run/public/50" }}
        style={styles.profileImage}
      />
      <Text style={styles.title}>Hi 👋, {name}</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={email}
        editable={false}
      />
      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={{ color: "white", textAlign: "center" }}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  profileImage: { width: 100, height: 100, borderRadius: 20, marginBottom: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#dedede",
    backgroundColor: "#f9f9f9",
    paddingLeft: 20,
    paddingVertical: 15,
    borderRadius: 100,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logoutBtn: {
    marginTop: 10,
    width: 150,
    backgroundColor: "red",
    color: "white",
    padding: 15,
    borderRadius: 100,
    textAlign: "center",
  },
});
