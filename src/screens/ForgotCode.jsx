import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { style } from '../style/style';
import { DiaryRepository } from '../database.service';
import { useFocusEffect } from '@react-navigation/native';

const ForgotCode = ({ navigation }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [lockData, setLockData] = useState(null);

  async function getQuestion() {
    const result = await DiaryRepository.getLock();
    if (result.length > 0) {
      setQuestion(result[0].question);
      setLockData(result[0]);
    }
  }

  const handleCheckAnswer = () => {
    if (!answer.trim()) {
      Alert.alert('Error', 'Please enter your answer.');
      return;
    }

    if (answer.trim().toLowerCase() === lockData.answer.trim().toLowerCase()) {
      Alert.alert(
        'Your Code',
        `🔒 ${lockData.code}`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Incorrect', 'The answer you provided is incorrect.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      getQuestion();
    }, [])
  );

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
            <Text style={style.headerText}>Forgot Code</Text>
          </View>


 <Image source={require("../assets/images/lock.png")} style={style.homeIg}/>

          <View style={style.form}>
            <Text style={style.question}>{question}</Text>

            <View style={style.row}>
              <Ionicons name="chatbubbles" size={30} />
              <TextInput
                placeholder="Your answer"
                placeholderTextColor={'gray'}
                style={style.lockInput}
                value={answer}
                onChangeText={setAnswer}
              />
            </View>

            <TouchableOpacity
              style={style.loginButton}
              onPress={handleCheckAnswer}
            >
              <Text style={style.loginText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

export default ForgotCode;
