import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Switch,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addTask } from "./redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);

  const handleSubmit = async () => {
    if (!title.trim()) {
      titleInputRef.current.focus();
      return;
    }

    if (!description.trim()) {
      descriptionInputRef.current.focus();
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      const response = await axios.post(
        "https://ticktick-backend.vercel.app/v1/tasks",
        {
          title,
          description,
          completed,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        Toast.show({
          type: "success",
          text1: "Task added successfully",
        });
        dispatch(addTask(response.data.task));
        navigation.goBack();
      } else {
        console.error("Failed to submit task");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Task</Text>
      <TextInput
        ref={titleInputRef}
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={handleSubmit}
        autoFocus
      />
      <TextInput
        ref={descriptionInputRef}
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        onSubmitEditing={handleSubmit}
        multiline
      />
      <View style={styles.switchContainer}>
        <Switch value={completed} onValueChange={setCompleted} />
        <Text>Completed</Text>
      </View>
      <Pressable
        style={styles.submitBtn}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
          >
            Add Task
          </Text>
        )}
      </Pressable>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
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
});
