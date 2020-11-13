import React from 'react';
import {SafeAreaView, StatusBar, Text, View} from 'react-native';

import usePinboard from 'hooks/usePinboard';
import Styles from 'lib/Styles';

export default () => {
  const pinboard = usePinboard();
  const [, , pinboardDiag] = usePinboard();
  const modeText = pinboardDiag.production ? 'production' : 'mock';

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
            <Text style={Styles.sectionDescription}>
              Logging in with an API token for user {pinboardDiag.user}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
