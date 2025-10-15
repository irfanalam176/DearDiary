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
import useUpdateCodeOnline from '../hooks/useUpdateCodeOnline';
import useSync from '../hooks/useSync';

const questionsList = [
  'What is your favorite animal?',
  'What is your mother’s maiden name?',
  'What was the name of your first school?',
  'What is your favorite color?',
  'What city were you born in?',
  'What is your favorite food?',
  'What is your father’s middle name?',
  'What is the name of your best childhood friend?',
  'What year did you graduate high school?',
  'What is the name of your first pet?',
];

const CreateLock = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [question, setQuestion] = useState(questionsList[0]);
  const [answer, setAnswer] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = async () => {
    if (!code.trim().toLocaleLowerCase() || !question.trim() || !answer.trim()) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    try {
      const result = await DiaryRepository.createLock({
        code,
        question,
        answer,
      });

      if (result.status == "inserted") {
        Alert.alert('Success', 'Lock saved successfully!');
        await useSync()
        navigation.goBack();
      }
      if (result.status == "updated") {
        Alert.alert('Success', 'Lock saved successfully!');
        await useUpdateCodeOnline(code,question,answer)
        navigation.navigate("drawer");
      }
    } catch (e) {
      console.log('Cannot set password' + JSON.stringify(e, null, 2));
    }
  };

  const handleSelectQuestion = q => {
    setQuestion(q);
    setModalVisible(false);
  };

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
            <Text style={style.headerText}>Create Code</Text>
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

            <View style={style.row}>
              <Ionicons name="help" size={30} />
              <TouchableOpacity
                style={[{ justifyContent: 'center' }]}
                onPress={() => setModalVisible(true)}
              >
                <Text
                  style={[
                    style.lockInput,
                    { color: question ? 'black' : 'gray' },
                  ]}
                >
                  {question || 'Select Security Question'}
                </Text>
              </TouchableOpacity>
            </View>

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

            <TouchableOpacity style={style.loginButton} onPress={handleSave}>
              <Text style={style.loginText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Modal for selecting questions */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 20,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}
              >
                Select Security Question
              </Text>
              <FlatList
                data={questionsList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectQuestion(item)}
                    style={{
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ddd',
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ImageBackground>
  );
};

export default CreateLock;
