import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useDispatch } from "react-redux";
import { updateTask, deleteTask } from "./redux/actions";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UpdateTask({ route, navigation }) {
  const { task } = route.params;
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [completed, setCompleted] = useState(task.completed);
  const [updateLoading, setUpdating] = useState(false);
  const [deleteLoading, setDeleting] = useState(false);
  const dispatch = useDispatch();
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);

  const handleUpdate = async () => {
    if (!title.trim()) {
      titleInputRef.current.focus();
      return;
    }

    if (!description.trim()) {
      descriptionInputRef.current.focus();
      return;
    }

    setUpdating(true);
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      const response = await axios.put(
        `https://ticktick-backend.vercel.app/v1/tasks/${task._id}`,
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
      if (response.status === 200) {
        dispatch(updateTask({ ...task, title, description, completed }));
        navigation.goBack();
      } else {
        console.error("Failed to submit task");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = () => {
    AsyncStorage.getItem("jwtToken").then(async (token) => {
      setDeleting(true);
      try {
        const response = await axios.delete(
          `https://ticktick-backend.vercel.app/v1/tasks/${task._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response:", response.status);

        if (response.status === 200) {
          console.log("Task deleted successfully:", response.data);
          dispatch(deleteTask(task._id));
          navigation.goBack();
        } else {
          console.error("There was an error deleting the task");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setDeleting(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Task</Text>
      <TextInput
        ref={titleInputRef}
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={handleUpdate}
      />
      <TextInput
        ref={descriptionInputRef}
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        onSubmitEditing={handleUpdate}
        multiline
      />

      <View style={styles.switchContainer}>
        <Switch value={completed} onValueChange={setCompleted} />
        <Text>Completed</Text>
      </View>
      <Pressable
        style={styles.submitBtn}
        onPress={handleUpdate}
        disabled={updateLoading}
      >
        {updateLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
          >
            Update Task
          </Text>
        )}
      </Pressable>
      <Pressable
        style={styles.deleteBtn}
        onPress={handleDelete}
        disabled={deleteLoading}
      >
        {deleteLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={{ color: "red", textAlign: "center" }}>Delete Task</Text>
        )}
      </Pressable>
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
  deleteBtn: {
    marginTop: 15,
    width: "100%",
    borderColor: "red",
    borderWidth: 1,
    color: "red",
    padding: 10,
    borderRadius: 100,
    textAlign: "center",
  },
});
