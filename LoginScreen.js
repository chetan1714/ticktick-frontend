import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://ticktick-backend.vercel.app/v1/auth/login",
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        await AsyncStorage.setItem("jwtToken", response.data.jwtToken);
        navigation.replace("Home");
      } else {
        Toast.show({
          type: "error",
          text1: response.data.message,
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 400) {
          Toast.show({
            type: "error",
            text1: error.response.data.message,
          });
        } else if (error.response.status === 404) {
          Toast.show({
            type: "error",
            text1: error.response.data.message,
          });
        } else {
          Toast.show({
            type: "error",
            text1: "An unexpected error occurred.",
          });
        }
      } else if (error.request) {
        Toast.show({
          type: "error",
          text1: "No response from server. Please try again later.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error during login. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/icon.jpg")}
        style={{ width: 200, height: 200 }}
      />
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Please sign in to continue.</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        ref={emailInputRef}
        onSubmitEditing={handleLogin}
        autoFocus
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        ref={passwordInputRef}
        onSubmitEditing={handleLogin}
      />
      <Pressable
        style={styles.submitBtn}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
          >
            Sign In
          </Text>
        )}
      </Pressable>

      <TouchableOpacity onPress={() => navigation.replace("SignUp")}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
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
  submitBtn: {
    marginTop: 10,
    width: "100%",
    backgroundColor: "black",
    color: "white",
    padding: 18,
    borderRadius: 100,
    textAlign: "center",
  },
  linkText: {
    color: "#d",
    marginTop: 15,
  },
});
