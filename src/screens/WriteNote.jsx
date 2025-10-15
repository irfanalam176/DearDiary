import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Keyboard,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {style} from '../style/style';
import DatePicker from 'react-native-date-picker';
import {DiaryRepository} from '../database.service';
import useSync from '../hooks/useSync';
import useInterstitialAd from '../hooks/useInterstitialAd';



const WriteNote = ({navigation, route}) => {
  const {category} = route.params;
  const [title, setTitle] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const webViewRef = useRef(null);
  const [webViewHeight, setWebViewHeight] = useState(
    Dimensions.get('window').height * 0.6,
  );
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const {loaded, showAd} = useInterstitialAd();

  // Keyboard listeners to resize WebView
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => setWebViewHeight(prev => prev - e.endCoordinates.height + 50),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setWebViewHeight(Dimensions.get('window').height * 0.6),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const formatDate = dateObj => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${dateObj.getDate()} ${
      monthNames[dateObj.getMonth()]
    } ${dateObj.getFullYear()}`;
  };

  // ✅ Save function with ad showing
  const handleSave = async () => {
    webViewRef.current?.injectJavaScript(`
        document.activeElement && document.activeElement.blur();
        window.ReactNativeWebView.postMessage("blurred");
        true;
      `);

    // Then dismiss keyboard after small delay
    setTimeout(() => {
      Keyboard.dismiss();
    }, 100);
    try {
      const entry = {
        title,
        content: htmlContent,
        date: formatDate(date),
      };
      await DiaryRepository.createEntry(entry);
      await useSync();
      Alert.alert('Success', 'Your note has been saved successfully.✔️', [
        {
          text: 'OK',
          onPress: () => {
            showAd(() => {
              navigation.goBack();
            });
          },
        },
      ]);

    } catch (e) {
      console.log('Cannot add data ' + e);
    }
  };

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
      <style>
        body {
          margin: 0;
          padding: 15px;
          font-family: -apple-system, sans-serif;
          font-size: 16px;
          line-height: 28px;
          background-color: white;
        }
        .lined-textarea {
          background-image: linear-gradient(to bottom, rgba(0,0,0,0.3) 1px, transparent 1px);
          background-size: 100% 28px;
          min-height: calc(28px * 20);
          border: none;
          outline: none;
          font-family: sans-serif;
        }
      </style>
    </head>
    <body>
      <div id="editor" class="lined-textarea" contenteditable="true"></div>
      <script>
        document.getElementById('editor').addEventListener('input', function() {
          window.ReactNativeWebView.postMessage(this.innerHTML);
        });
        document.getElementById('editor').focus();
      </script>
    </body>
    </html>
  `;

  return (
    <ImageBackground
      style={{width: '100%', height: '100%'}}
      source={require('../assets/images/noteBg.png')}>
      <DatePicker
        modal
        mode="date"
        open={open}
        date={date}
        onConfirm={newDate => setDate(newDate)}
        onCancel={() => setOpen(false)}
      />

      <View style={{padding: 16}}>
        <View style={style.noteHeader}>
          <View style={style.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text style={style.headerText}>DearDiary</Text>
          </View>
          <TouchableOpacity style={style.saveBtn} onPress={handleSave}>
            <Text style={style.saveBtnTxt}>SAVE</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={style.dateBtn} onPress={() => setOpen(true)}>
          <Ionicons name="calendar-number" size={24} color="black" />
          <Text style={style.dateInput}>{formatDate(date)}</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Title"
          style={style.titleInput}
          placeholderTextColor="gray"
          onChangeText={setTitle}
        />

        <View style={[style.webViewContainer, {height: webViewHeight}]}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{html: htmlTemplate}}
            style={style.webView}
            javaScriptEnabled
            onMessage={event => setHtmlContent(event.nativeEvent.data)}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default WriteNote;
