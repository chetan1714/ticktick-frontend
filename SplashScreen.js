import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setTasks } from './redux/actions';

export default function SplashScreen({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkTokenAndFetchTasks = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
          const response = await axios.get('https://ticktick-backend.vercel.app/v1/tasks', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            dispatch(setTasks(response.data.tasks));
            navigation.replace('Home');
          } else {
            navigation.replace('Login');
          }
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        navigation.replace('Login');
      }
    };
    checkTokenAndFetchTasks();
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/icon.jpg')}
        style={{ width: 250, height: 250 }}
      />
      <ActivityIndicator size="large"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});