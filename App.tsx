import 'react-native-gesture-handler';

import React from 'react';
import {StatusBar} from 'react-native';

const BetterpinsSecrets = require('betterpins.secrets.json');
const BetterpinsSettings = require('betterpins.settings.json');

import {PinboardContext, usePinboard} from 'hooks/usePinboard';
import TabBarNavContainer from 'components/TabBarNavContainer';

const App = () => {
  const {pinboard, pinboardLogin} = usePinboard();
  const credential = {
    username: BetterpinsSecrets.pinboardApiUser,
    authTokenSecret: BetterpinsSecrets.pinboardApiSecret,
  };
  console.debug(
    `App(): Before pinboardLogin(), credential is set to: ${JSON.stringify(
      credential,
    )}`,
  );
  pinboardLogin(BetterpinsSettings.mode === 'production', credential);
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
