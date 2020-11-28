import 'react-native-gesture-handler';

import React, {useState, useEffect, useCallback} from 'react';
import ShareMenu from 'react-native-share-menu';
import {StatusBar} from 'react-native';

type SharedItem = {
  mimeType: string;
  data: string;
  extraData: any;
};

import {PinboardContext, usePinboard} from 'hooks/usePinboard';
import TabBarNavContainer from 'components/TabBarNavContainer';

const App = () => {
  const {
    firstRun,
    pinboard,
    setConfigurationFromPersistentStorage,
    setAppConfiguration,
    removeCredentials,
  } = usePinboard();

  if (firstRun) {
    setConfigurationFromPersistentStorage();
  }

  /*
   *
   */
  const [sharedData, setSharedData] = useState('');
  const [sharedMimeType, setSharedMimeType] = useState('');

  const handleShare = useCallback((item?: SharedItem) => {
    if (!item) {
      return;
    }

    const {mimeType, data, extraData} = item;

    setSharedData(data);
    setSharedMimeType(mimeType);
    // You can receive extra data from your custom Share View
    console.log(extraData);
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, [handleShare]);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);

    return () => {
      listener.remove();
    };
  }, [handleShare]);

  console.log(`App.tsx: sharedData: ${sharedData}`);
  console.log(`App.tsx: sharedMimeType: ${sharedMimeType}`);
  /*
   *
   */

  return (
    <>
      <PinboardContext.Provider
        value={{
          pinboard,
          setAppConfiguration,
          removeCredentials,
        }}>
        <StatusBar barStyle="dark-content" />
        <TabBarNavContainer />
      </PinboardContext.Provider>
    </>
  );
};

export default App;
