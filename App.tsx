import 'react-native-gesture-handler';

import React from 'react';
import {StatusBar} from 'react-native';

// const LightmarksSecrets = require('lightmarks.secrets.json');
// const LightmarksSettings = require('lightmarks.settings.json');
const LightmarksSecrets = {
  pinboardApiUser: 'DefaultUsername',
  pinboardApiSecret: 'DefaultApiSecret',
};
const LightmarksSettings = {
  mode: 'mock',
};

import {PinboardContext, usePinboard} from 'hooks/usePinboard';
import TabBarNavContainer from 'components/TabBarNavContainer';

const App = () => {
  const {pinboard, pinboardLogin} = usePinboard();
  const credential = {
    username: LightmarksSecrets.pinboardApiUser,
    authTokenSecret: LightmarksSecrets.pinboardApiSecret,
  };
  console.debug(
    `App(): Before pinboardLogin(), credential is set to: ${JSON.stringify(
      credential,
    )}`,
  );
  pinboardLogin(LightmarksSettings.mode === 'production', credential);
  console.debug(
    `App(): After pinboardLogin(), credential is set to: ${JSON.stringify(
      credential,
    )}`,
  );

  return (
    <>
      <PinboardContext.Provider value={{pinboard, pinboardLogin}}>
        <StatusBar barStyle="dark-content" />
        <TabBarNavContainer />
      </PinboardContext.Provider>
    </>
  );
};

export default App;
