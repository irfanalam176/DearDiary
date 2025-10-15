import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { style } from '../style/style';
import LoginInputs from '../components/LoginInputs';
import { url } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useGetOnlineDate from '../hooks/useGetOnlineDate';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Regex patterns
    const usernameRegex = /^.{4,}$/; // at least 4 characters
    const passwordRegex = /^.{8,}$/; // at least 8 characters

    // Validate
    if (!usernameRegex.test(username)) {
      setError('Username must be at least 4 characters long');
      return;
    }
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
        
        if (response.status == 400 || response.status == 401) {
          setError(`Wrong credentials check your username and password`);
        }
        else {
          await AsyncStorage.setItem('username', JSON.stringify(username));
          setError('');
          await useGetOnlineDate(username)
          navigation.navigate('Home');
        }
    } catch (e) {
      console.log('Login failed: ' + e);
      setError('Login failed, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/loginBg.png')}
      style={{ height: '100%', width: '100%' }}
    >
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <ScrollView
          contentContainerStyle={style.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[style.header, { width: '100%', margin: 16 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text style={style.headerText}>Login</Text>
          </View>

          <View style={style.textContainer}>
            <Text style={style.bigLetter}>D</Text>
            <View style={style.rightText}>
              <Text style={[style.smallText,{marginBottom:-10}]}>EAR</Text>
              <Text style={style.smallText}>DIARY</Text>
            </View>
          </View>

          <Image
            style={style.loginImage}
            source={require('../assets/images/loginBook.png')}
          />
          <Text style={style.error}>{error}</Text>
          <LoginInputs
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
          />

          <LoginInputs
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />

          <TouchableOpacity
            style={[style.loginButton, { marginBottom: 20 }]}
            onPress={handleLogin}
           disabled={isLoading}
          >
            <Text style={style.loginText}>Login</Text>
            {isLoading && <ActivityIndicator size={30} color={'white'} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[style.loginButton, { marginBottom: 20 }]}
            onPress={() => navigation.navigate('register')}
          >
            <Text style={style.loginText}>Create an account</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default Login;
