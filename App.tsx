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
import {StatusBar} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const BetterpinsSecrets = require('betterpins.secrets.json');
const BetterpinsSettings = require('betterpins.settings.json');

import About from 'components/About';
import DumbTagView from 'components/DumbTagView';
import usePinboard from 'hooks/usePinboard';

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

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <TabBar.Navigator>
          <TabBar.Screen name="DumbTags" component={DumbTagView} />
          <TabBar.Screen name="About" component={About} />
        </TabBar.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
