import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { style } from '../style/style';
import { DiaryRepository } from '../database.service';

const CheckCode = ({ navigation }) => {
  const [code, setCode] = useState('');

  async function checkCode() {
    Keyboard.dismiss()
    try {
      const result = await DiaryRepository.checkCode(code);
      if (result.length > 0) {
        navigation.navigate('createLock');
      } else {
        Alert.alert('Code Error', 'Please Enter Correct Code');
      }
    } catch (e) {
      console.log('Code checking error' + e);
    }
  }

  return (
    <ImageBackground
      source={require('../assets/images/loginBg.png')}
      style={{ width: '100%', height: '100%' }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ padding: 16 }}>
          <View style={style.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text style={style.headerText}>Enter Code</Text>
          </View>

          <Image
            source={require('../assets/images/lock.png')}
            style={style.homeIg}
          />
          <View style={style.form}>
            <View style={style.row}>
              <Ionicons name="keypad" size={30} />
              <TextInput
                placeholder="Enter Code"
                placeholderTextColor={'gray'}
                style={style.lockInput}
                value={code}
                onChangeText={setCode}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={style.loginButton} onPress={checkCode}>
              <Text style={style.loginText}>Unlock</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[style.loginButton, { marginTop: 10 }]}
              onPress={() => navigation.navigate('forgotCode')}
            >
              <Text style={style.loginText}>Forgot Code?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

export default CheckCode;
