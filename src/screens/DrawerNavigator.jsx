import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import HomeScreen from './Home';
import CreateLock from './CreateLock';
import Login from './Login';
import CheckCode from './CheckCode';
import { DiaryRepository } from '../database.service';
import { style } from '../style/style';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const [isProtected, setIsProtected] = useState(false);
  const [username, setUsername] = useState(null);

  async function checkProtected() {
    try {
      const result = await DiaryRepository.getLock();
      setIsProtected(result.length > 0);
    } catch (e) {
      console.log('Cannot get protected: ' + e);
    }
  }

  async function getUsername() {
    try {
      const user = await AsyncStorage.getItem('username');
      setUsername(user);
    } catch (e) {
      console.log('Error getting username: ' + e);
    }
  }

  async function handleLogout(navigation) {
    try {
      await AsyncStorage.removeItem('username');
      setUsername(null);
      Alert.alert('Logged out', 'You have been logged out');
      navigation.navigate('Home');
    } catch (e) {
      console.log('Error removing username: ' + e);
    }
  }

  useFocusEffect(
    useCallback(() => {
      checkProtected();
      getUsername();
    }, [])
  );

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false,drawerStyle:{
        backgroundColor:"#FFBDBD"
      } }}
      
      drawerContent={({ navigation }) => (
        <ScrollView contentContainerStyle={styles.drawerContainer}>

                    <View style={style.textContainer}>
                      <Text style={style.bigLetter}>D</Text>
                      <View style={style.rightText}>
                        <Text style={[style.smallText,{marginBottom:-10}]}>EAR</Text>
                        <Text style={style.smallText}>DIARY</Text>
                      </View>
                    </View>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#C9E2FF' }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="home" size={25} color="#000" />
            <Text style={styles.cardText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#C7F4F6' }]}
            onPress={() => navigation.navigate(isProtected ? 'CheckCode' : 'CreateLock')}
          >
            <Ionicons name="lock-closed" size={25} color="#000" />
            <Text style={styles.cardText}>Lock</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#e5c7f6ff' }]}
            onPress={() => Linking.openURL("https://deardiary-privacy-policy.studiosiapps.com/")}
          >
            <Ionicons name="shield-checkmark" size={25} color="#000" />
            <Text style={styles.cardText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#C8FAD6' }]}
            onPress={() => {
              if (username) {
                handleLogout(navigation);
              } else {
                navigation.navigate('Login');
              }
            }}
          >
            <Ionicons
              name={username ? 'log-out' : 'log-in'}
              size={25}
              color="#000"
            />
            <Text style={styles.cardText}>
              {username ? 'Logout' : 'Login'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="CreateLock" component={CreateLock} />
      <Drawer.Screen name="CheckCode" component={CheckCode} />
      <Drawer.Screen name="Login" component={Login} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    padding: 16
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardText: {
    color: '#000000',
    fontSize: 20,
    fontFamily: 'Baloo2-Bold',
    marginLeft: 12,
  },
});

export default DrawerNavigator;
