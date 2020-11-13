/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StatusBar, Text, View} from 'react-native';

import Pinboard from 'node-pinboard';

const BetterpinsSecrets = require('betterpins.secrets.json');
const BetterpinsSettings = require('betterpins.settings.json');

import DumbTagView from 'components/DumbTagView';
import FauxPinboard from 'lib/FauxPinboard';
import Styles from 'lib/Styles';

const App = () => {
  const token = `${BetterpinsSecrets.pinboardApiUser}:${BetterpinsSecrets.pinboardApiSecret}`;
  console.debug(`Using token: ${token}`);

  const pinboard =
    BetterpinsSettings.mode === 'mock'
      ? new FauxPinboard(token)
      : new Pinboard(token);
  const modeText = BetterpinsSettings.mode === 'mock' ? 'mock' : 'production';

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
      <DumbTagView pinboard={pinboard} />
    </>
  );
};

export default App;
