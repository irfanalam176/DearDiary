import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import mobileAds from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Notes from './src/screens/Notes';
import WriteNote from './src/screens/WriteNote';
import { initializeDatabase } from './src/database.service';
import ViewNotes from './src/screens/ViewNotes';
import Events from './src/screens/Events';
import WriteEvents from './src/screens/WriteEvents';
import ViewEvent from './src/screens/ViewEvent';
import DrawerNavigator from './src/screens/DrawerNavigator';
import Protected from './src/screens/Protected';
import WriteProtected from './src/screens/WriteProtected';
import ViewProtected from './src/screens/ViewProtected';
import EnterCode from './src/screens/EnterCode';
import ForgotCode from './src/screens/ForgotCode';
import Register from './src/screens/Register';
import useSync from './src/hooks/useSync';
import CreateLock from './src/screens/CreateLock';
import Onboarding from './src/screens/Onboarding';
import Provider from './src/hooks/context/Provider';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(null);

  useEffect(() => {
    async function setupApp() {
      try {
        // Check onboarding first (fast)
        const onboarding = await AsyncStorage.getItem('onboarding_completed');
        setIsOnboardingCompleted(!!onboarding);

        // Hide splash early
        SplashScreen.hide();

        // Then run heavy stuff in background (non-blocking)
        initializeDatabase();
        useSync();
        mobileAds().initialize().then(()=>console.log("admob initialized")
        );
      } catch (error) {
        console.log('Initialization error:', error);
        SplashScreen.hide();
      }
    }

    setupApp();
  }, []);

  if (isOnboardingCompleted === null) {
    return <View />; // can be a loading component
  }

  return (
<Provider>
      <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isOnboardingCompleted ? 'drawer' : 'onBoarding'}
      >
        {!isOnboardingCompleted && (
          <Stack.Screen name="onBoarding" component={Onboarding} />
        )}
        <Stack.Screen name="drawer" component={DrawerNavigator} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="enterCode" component={EnterCode} />
        <Stack.Screen name="createLock" component={CreateLock} />
        <Stack.Screen name="forgotCode" component={ForgotCode} />
        <Stack.Screen name="allNotes" component={Notes} />
        <Stack.Screen name="writeNote" component={WriteNote} />
        <Stack.Screen name="viewNotes" component={ViewNotes} />
        <Stack.Screen name="events" component={Events} />
        <Stack.Screen name="writeEvent" component={WriteEvents} />
        <Stack.Screen name="viewEvent" component={ViewEvent} />
        <Stack.Screen name="protected" component={Protected} />
        <Stack.Screen name="writeProtected" component={WriteProtected} />
        <Stack.Screen name="viewProtected" component={ViewProtected} />
      </Stack.Navigator>
    </NavigationContainer>
</Provider>
  );
};

export default App;
