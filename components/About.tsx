import React, {useContext} from 'react';
import {SafeAreaView, StatusBar, Text, View} from 'react-native';

import {PinboardContext} from 'hooks/usePinboard';
import {AppStyles} from 'lib/Styles';
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
        <View style={AppStyles.body}>
          <View style={AppStyles.sectionContainer}>
            <Text style={AppStyles.sectionTitle}>Welcome to betterpin</Text>
            <Text style={AppStyles.sectionDescription}>
              by Micah R Ledbetter
            </Text>
            <Text style={AppStyles.sectionDescription}>
              Here is where there will be a UI for logging in or something
            </Text>
            <Text style={AppStyles.sectionDescription}>
              This app is running in {modeText} mode.
            </Text>
            <Text style={AppStyles.sectionDescription}>{loggedInText}</Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
