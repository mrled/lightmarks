import React, {useContext} from 'react';
import {SafeAreaView, StatusBar, Text, View} from 'react-native';

import {PinboardContext} from 'hooks/usePinboard';
import Styles from 'lib/Styles';
import {PinboardMode} from 'lib/Pinboard';

export default () => {
  const {pinboard} = useContext(PinboardContext);
  const modeText =
    pinboard.mode === PinboardMode.Production ? 'production' : 'mock';
  const loggedInText = pinboard.apiCredential
    ? `Logged in as user ${pinboard.apiCredential.username}`
    : 'Not logged in';

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={Styles.body}>
          <View style={Styles.sectionContainer}>
            <Text style={Styles.sectionTitle}>Welcome to betterpin</Text>
            <Text style={Styles.sectionDescription}>by Micah R Ledbetter</Text>
            <Text style={Styles.sectionDescription}>
              Here is where there will be a UI for logging in or something
            </Text>
            <Text style={Styles.sectionDescription}>
              This app is running in {modeText} mode.
            </Text>
            <Text style={Styles.sectionDescription}>{loggedInText}</Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
