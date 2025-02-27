import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Button,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { setTasks } from "./redux/actions";

export default function HomeScreen({ navigation }) {
  const tasks = useSelector((state) => state.tasks.tasks);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      const response = await axios.get(
        "https://ticktick-backend.vercel.app/v1/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", response.status);

      if (response.status === 200) {
        dispatch(setTasks(response.data.tasks));
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="menu" size={24} color="black" />
        <Text style={styles.title}>TickTick</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{ uri: "https://avatar.iran.liara.run/public/50" }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : tasks.length === 0 ? (
        <View
          flex={1}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Image
            source={{
              uri: "https://static.vecteezy.com/system/resources/previews/005/073/071/non_2x/user-not-found-account-not-register-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg",
            }}
            width={200}
            height={180}
          />
          <Pressable
            style={styles.endButton}
            onPress={() => navigation.navigate("AddTask")}
          >
            <Ionicons name="add" size={24} color="white" marginRight={5} />
            <Text style={{ color: "white" }}>Add Task</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ marginVertical: 25 }}>
          <FlatList
            data={tasks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("UpdateTask", { task: item })
                }
              >
                <View
                  style={[styles.taskItem, { borderRadius: 20 }]}
                  key={item._id}
                >
                  <Text
                    style={
                      item.completed
                        ? { textDecorationLine: "line-through" }
                        : {}
                    }
                  >
                    {item.title}
                  </Text>
                  <Ionicons
                    name={
                      item.completed ? "checkmark-circle" : "ellipse-outline"
                    }
                    size={24}
                    color={item.completed ? "green" : "black"}
                  />
                </View>
              </Pressable>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          />

          <View flexDirection="row" justifyContent="center">
            <Pressable
              style={styles.endButton}
              onPress={() => navigation.navigate("AddTask")}
            >
              <Text style={{ color: "white" }}>Add Task</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "white", marginTop: 30 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "bold" },
  profileImage: { width: 35, height: 35, borderRadius: 20 },
  toggleContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "#000",
    borderRadius: 20,
    padding: 4,
  },
  toggleButtonActive: {
    flex: 1,
    alignItems: "center",
    padding: 8,
    backgroundColor: "white",
    borderRadius: 20,
  },
  toggleButton: { flex: 1, alignItems: "center", padding: 8, color: "white" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  categoryItem: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
    width: 100,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginBottom: 15,
  },
  endButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 10,
    width: 150,
    flexDirection: "row",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "black",
    color: "white",
    padding: 8,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: "center",
  },
});
