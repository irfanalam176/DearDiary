import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TextInput,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {style} from '../style/style';
import {useFocusEffect} from '@react-navigation/native';
import {DiaryRepository} from '../database.service';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.BANNER // Test ID (safe for development)
  : 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx'; // Replace with your real AdMob unit ID before release

export default function HomeScreen({navigation}) {
  const [isProtected, setIsProtected] = useState(false);

  function navigateTo(category, page, path) {
    navigation.navigate(path, {category: category, page: page});
  }

  async function checkProtected() {
    try {
      const result = await DiaryRepository.getLock();

      if (result.length > 0) {
        setIsProtected(true);
      } else {
        setIsProtected(false);
      }
    } catch (e) {
      console.log('Cannot get protected' + e);
    }
  }
  useFocusEffect(
    useCallback(() => {
      checkProtected();
    }, []),
  );

  return (
    <ImageBackground
      source={require('../assets/images/home.png')}
      style={{width: '100%', height: '100%'}}>
      <ScrollView contentContainerStyle={{padding: 16}}>
        <View
          style={[
            style.header,
            {flexDirection: 'row', justifyContent: 'space-between'},
          ]}>
          <Text style={style.headerText}>Home</Text>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Ionicons name="menu-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>

        <Image
          source={require('../assets/images/homeImg.png')}
          style={style.homeIg}
        />

        <View style={{paddingHorizontal: 25}}>
          <TouchableOpacity
            style={[style.recentCard, {backgroundColor: '#C8FAD6'}]}
            onPress={() => navigateTo('general', 'Notes', 'allNotes')}>
            <Image
              source={require('../assets/images/note.png')}
              style={style.recentIcon}
            />
            <Text style={style.recentText}>Notes</Text>
            <Ionicons name="chevron-forward" size={20} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[style.recentCard, {backgroundColor: '#C7F4F6'}]}
            onPress={() => navigateTo('events', 'Events', 'events')}>
            <Image
              source={require('../assets/images/event.png')}
              style={style.recentIcon}
            />
            <Text style={style.recentText}>Events</Text>
            <Ionicons name="chevron-forward" size={20} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              style.recentCard,
              {backgroundColor: isProtected == false ? `#9AA6B2` : '#C9E2FF'},
            ]}
            onPress={() => {
              isProtected
                ? navigation.navigate('enterCode')
                : Alert.alert(
                    'Security Required',
                    'Set a lock from the menu to enable protected notes.',
                  );
            }}>
            <Image
              source={require('../assets/images/lock.png')}
              style={style.recentIcon}
            />
            <Text style={style.recentText}>Protected Notes</Text>
            <Ionicons name="chevron-forward" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </ScrollView>
          <View style={style.bannerContainer}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdFailedToLoad={(e)=>console.log(e)
          }
        />
      </View>
    </ImageBackground>
  );
}
