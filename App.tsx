import 'react-native-gesture-handler';

import React, {useState, useEffect, useCallback} from 'react';

// @ts-ignore
import ShareMenu from 'react-native-share-menu';

import {StatusBar} from 'react-native';
import {QueryCache, ReactQueryCacheProvider, setConsole} from 'react-query';

import {
  AppConfigurationContext,
  useAppConfiguration,
} from 'hooks/useAppConfiguration';
import {
  SmartRequestQueueContext,
  useSmartRequestQueue,
} from 'hooks/useSmartRequestQueue';
import TabBarNavContainer from 'components/TabBarNavContainer';
import {useWhyDidYouUpdate} from 'hooks/useWhyDidYouUpdate';

// Work around console.error everywhere in React Query
// https://react-query.tanstack.com/docs/react-native
setConsole({
  log: console.log,
  warn: console.warn,
  error: console.warn,
});

const appQueryCache = new QueryCache();

if (__DEV__) {
  import('react-query-native-devtools').then(({addPlugin}) => {
    addPlugin(appQueryCache);
  });
}

type SharedItem = {
  mimeType: string;
  data: string;
  extraData: any;
};

const App = () => {
  /* Apply the application configuration
   */
  useWhyDidYouUpdate('App', {});
  const {
    firstRun,
    setFirstRun,
    setAppConfigFromStorage,
    productionMode,
    setProductionModeWrapper,
    unsetProduction,
    apiAuthTokenCredential,
    setApiAuthTokenCredentialWrapper,
    unsetApiAuthTokenCredential,
    feedsTokenSecret,
    setFeedsTokenSecretWrapper,
    unsetFeedsTokenSecret,
  } = useAppConfiguration();
  const appConfigContextValue = {
    productionMode: !!productionMode, // If its undefined, assume its false
    setProductionModeWrapper,
    unsetProduction,
    apiAuthTokenCredential,
    setApiAuthTokenCredentialWrapper,
    unsetApiAuthTokenCredential,
    feedsTokenSecret,
    setFeedsTokenSecretWrapper,
    unsetFeedsTokenSecret,
  };

  /* Configure the smart request queue
   */
  const {enqueueFactory, enqueue, queue} = useSmartRequestQueue();

  const smartRequestQueueContextValue = {
    enqueueFactory,
    enqueue,
    queue,
  };

  useEffect(() => {
    /* Get app configuration if we haven't done that yet
     */
    if (firstRun) {
      setFirstRun(false);
      setAppConfigFromStorage();
    }
  }, [firstRun, setAppConfigFromStorage, setFirstRun]);

  /* Handle opening the app from the share extension.
   *
   * ... Not sure I actually need this?
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
  /* End share sheet section
   */

  return (
    <>
      <ReactQueryCacheProvider queryCache={appQueryCache}>
        <AppConfigurationContext.Provider value={appConfigContextValue}>
          <SmartRequestQueueContext.Provider
            value={smartRequestQueueContextValue}>
            <StatusBar barStyle="dark-content" />
            <TabBarNavContainer />
          </SmartRequestQueueContext.Provider>
        </AppConfigurationContext.Provider>
      </ReactQueryCacheProvider>
    </>
  );
};

export default App;
