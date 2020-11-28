import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import PressableAnchor from 'components/PressableAnchor';
import {PinboardContext} from 'hooks/usePinboard';
import {AppStyles} from 'style/Styles';
import {PinboardMode} from 'lib/Pinboard';

const LogInOutButton = ({
  loggedIn,
  loginAction,
  logoutAction,
}: {
  loggedIn: boolean;
  loginAction: () => void;
  logoutAction: () => void;
}) => {
  const status = loggedIn ? 'Logged in' : 'Logged out';
  const buttonText = loggedIn ? 'Log out' : 'Log in';
  const action = loggedIn ? logoutAction : loginAction;
  return (
    <View>
      <Text style={AppStyles.textInputLabel}>Current status: {status}</Text>
      <View style={AppStyles.loginButtonView}>
        <Button title={buttonText} onPress={action} />
      </View>
    </View>
  );
};

export default () => {
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [tokenSecret, setTokenSecret] = useState<string | undefined>(undefined);
  const [productionMode, setProductionMode] = useState<boolean | undefined>(
    false,
  );
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const pinboardMode = productionMode
    ? PinboardMode.Production
    : PinboardMode.Mock;
  const {pinboard, setAppConfiguration, removeCredentials} = useContext(
    PinboardContext,
  );

  useEffect(() => {
    setUsername(pinboard.credential?.username);
    setTokenSecret(pinboard.credential?.authTokenSecret);
    setProductionMode(pinboard.mode === PinboardMode.Production);
    setLoggedIn(pinboard.credential?.authTokenSecret !== undefined);
  }, [pinboard.apiCredential, pinboard.credential, pinboard.mode]);

  const login = () => {
    console.log(
      `About.tsx: Logging in as ${username} with secret ${tokenSecret}`,
    );
    setAppConfiguration(pinboardMode, username, tokenSecret);
  };
  const logout = () => {
    console.log(`About.tsx: Logging out from ${username}`);
    removeCredentials();
  };

  /* Wrapper function that sets production mode and gets a new Pinboard object
   */
  const setProductionModeWrapper: (prod: boolean) => void = (prod: boolean) => {
    setProductionMode(prod);
    const newPinboardMode = prod ? PinboardMode.Production : PinboardMode.Mock;
    setAppConfiguration(newPinboardMode, username, tokenSecret);
  };

  const modeText =
    pinboard.mode === PinboardMode.Production ? 'production' : 'mock';
  const loggedInText = loggedIn
    ? `Logged in as user ${pinboard.apiCredential?.username}`
    : 'Not logged in';

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={AppStyles.screenRootScrollView}>
          <View style={AppStyles.body}>
            <View style={AppStyles.sectionContainer}>
              <Text style={AppStyles.sectionTitle}>Welcome to Lightmarks</Text>
              <PressableAnchor href="https://me.micahrl.com">
                <Text style={AppStyles.linkColor}>by Micah R Ledbetter</Text>
              </PressableAnchor>
            </View>

            <View style={AppStyles.sectionContainer}>
              <Text style={AppStyles.sectionTitle}>Log in to Pinboard</Text>

              <View style={AppStyles.loginSubsection}>
                <Text style={AppStyles.textInputLabel}>Username</Text>
                <TextInput
                  style={AppStyles.textInputBox}
                  textAlignVertical="top"
                  onChangeText={(newText: string) => setUsername(newText)}
                  value={username}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="username"
                />
              </View>

              <View style={AppStyles.loginSubsection}>
                <Text style={AppStyles.textInputLabel}>API token</Text>
                <PressableAnchor href="https://m.pinboard.in/settings/password">
                  <Text
                    style={{
                      ...AppStyles.textInputLabel,
                      ...AppStyles.linkColor,
                    }}>
                    Found in your Pinboard account settings
                  </Text>
                </PressableAnchor>
                <TextInput
                  style={AppStyles.textInputBox}
                  textAlignVertical="top"
                  onChangeText={(newText: string) => setTokenSecret(newText)}
                  value={tokenSecret}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true}
                  textContentType="password"
                />
              </View>

              <View style={AppStyles.loginSubsection}>
                <Text style={AppStyles.textInputLabel}>
                  Enable production mode. Turn this off to use mock data, which
                  can be helpful when debugging.
                </Text>
                <Switch
                  value={productionMode}
                  onValueChange={() =>
                    setProductionModeWrapper(!productionMode)
                  }
                />
              </View>

              <View style={AppStyles.loginSubsection}>
                <LogInOutButton
                  loggedIn={loggedIn}
                  loginAction={login}
                  logoutAction={logout}
                />
              </View>
            </View>

            <View style={AppStyles.sectionContainer}>
              <Text style={AppStyles.sectionTitle}>Debugging information</Text>
              <Text style={AppStyles.sectionDescription}>
                This app is running in {modeText} mode.
              </Text>
              <Text style={AppStyles.sectionDescription}>{loggedInText}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
