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
import {AppConfigurationContext} from 'hooks/useAppConfiguration';
import {AppStyles} from 'style/Styles';

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
  const [screenUsername, setScreenUsername] = useState<string | undefined>(
    undefined,
  );
  const [screenTokenSecret, setScreenTokenSecret] = useState<
    string | undefined
  >(undefined);
  const [screenProdMode, setScreenProdMode] = useState<boolean | undefined>(
    false,
  );
  const [screenLoggedIn, setScreenLoggedIn] = useState<boolean>(false);

  const {
    apiAuthTokenCredential,
    productionMode,
    setApiAuthTokenCredentialWrapper,
    setProductionModeWrapper,
    unsetApiAuthTokenCredential,
    // setAppConfiguration,
    // removeCredentials,
  } = useContext(AppConfigurationContext);

  useEffect(() => {
    setScreenUsername(apiAuthTokenCredential?.username);
    setScreenTokenSecret(apiAuthTokenCredential?.password);
    setScreenProdMode(productionMode);
    setScreenLoggedIn(apiAuthTokenCredential?.password !== undefined);
  }, [apiAuthTokenCredential, productionMode]);

  const login = () => {
    console.log(
      `SettingsScreen: Logging in as ${screenUsername} with secret ${screenTokenSecret}`,
    );
    if (screenUsername && screenTokenSecret) {
      setApiAuthTokenCredentialWrapper({
        username: screenUsername,
        password: screenTokenSecret,
      });
    } else {
      unsetApiAuthTokenCredential();
    }
    setProductionModeWrapper(!!screenProdMode);
  };

  const logout = () => {
    console.log(`SettingsScreen: Logging out from ${screenUsername}`);
    unsetApiAuthTokenCredential();
  };

  const modeText = screenProdMode ? 'production' : 'mock';
  const loggedInText = screenLoggedIn
    ? `Logged in as user ${apiAuthTokenCredential?.username}`
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
                  onChangeText={(newText: string) => setScreenUsername(newText)}
                  value={screenUsername}
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
                  onChangeText={(newText: string) =>
                    setScreenTokenSecret(newText)
                  }
                  value={screenTokenSecret}
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
                  value={screenProdMode}
                  onValueChange={() =>
                    setProductionModeWrapper(!screenProdMode)
                  }
                />
              </View>

              <View style={AppStyles.loginSubsection}>
                <LogInOutButton
                  loggedIn={screenLoggedIn}
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
