/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'react-native-gesture-handler';

import React from 'react';
import {SafeAreaView, StatusBar, Text, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const BetterpinsSecrets = require('betterpins.secrets.json');
const BetterpinsSettings = require('betterpins.settings.json');

import DumbTagView from 'components/DumbTagView';
import usePinboard from 'hooks/usePinboard';
import Styles from 'lib/Styles';

const TabBar = createBottomTabNavigator();

const App = () => {
  const [, pinboardLogin, pinboardDiag] = usePinboard();
  if (!pinboardDiag.loggedIn) {
    pinboardLogin(
      BetterpinsSecrets.pinboardApiUser,
      BetterpinsSecrets.pinboardApiSecret,
      BetterpinsSettings.mode === 'production',
    );
  }
  const modeText = pinboardDiag.production ? 'production' : 'mock';

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={Styles.body}>
          <View style={Styles.sectionContainer}>
            <Text style={Styles.sectionTitle}>Welcome to betterpin</Text>
            <Text style={Styles.sectionDescription}>
              Here is where there will be a UI for logging in or something
            </Text>
            <Text style={Styles.sectionDescription}>
              This app is running in {modeText} mode.
            </Text>
            <Text style={Styles.sectionDescription}>
              Logging in with an API token for user{' '}
              {BetterpinsSecrets.pinboardApiUser}
            </Text>
          </View>
        </View>
      </SafeAreaView>
      <NavigationContainer>
        <TabBar.Navigator>
          <TabBar.Screen name="DumbTags" component={DumbTagView} />
        </TabBar.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
