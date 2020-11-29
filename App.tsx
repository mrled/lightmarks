import 'react-native-gesture-handler';

import React, {useState, useEffect, useCallback} from 'react';
import ShareMenu from 'react-native-share-menu';
import {StatusBar} from 'react-native';
import {QueryCache, ReactQueryCacheProvider, setConsole} from 'react-query';

import {PinboardContext, usePinboard} from 'hooks/usePinboard';
import {
  SmartRequestQueueContext,
  useSmartRequestQueue,
} from 'hooks/useSmartRequestQueue';
import TabBarNavContainer from 'components/TabBarNavContainer';

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
  /* Configure the smart request queue
   */
  const {
    enqueueFactory,
    queue,
    setDefaultQueueKey,
    setQueueConfig,
  } = useSmartRequestQueue();

  /* The queue key is always the same.
   * smart-request-balancer was designed to have keyed queues,
   * where you can e.g. send X messages per second per user.
   * In this example, you might use the username as the key.
   * The Pinboard API doesn't have keyed queues, so we use a constant for the key.
   */
  setDefaultQueueKey('PinboardQueueKey');

  setQueueConfig({
    rules: {
      // Default queue: one request every 3 seconds
      common: {
        rate: 1,
        limit: 3,
        priority: 1,
      },
      // API's posts/recent call is more stringent: one request every minute
      apiPostsRecent: {
        rate: 1,
        limit: 60,
        priority: 1,
      },
      // API's posts/all call is still more stringent: one post every 5 minutes
      apiPostsAll: {
        rate: 1,
        limit: 300,
        priority: 1,
      },
    },
    retryTime: 9,
  });

  const smartRequestQueueContextValue = {
    enqueueFactory,
    queue,
  };

  /* Configure Pinboard
   */
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
  const pinboardContextValue = {
    pinboard,
    setAppConfiguration,
    removeCredentials,
  };

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
      <ReactQueryCacheProvider queryCache={appQueryCache}>
        <SmartRequestQueueContext.Provider
          value={smartRequestQueueContextValue}>
          <PinboardContext.Provider value={pinboardContextValue}>
            <StatusBar barStyle="dark-content" />
            <TabBarNavContainer />
          </PinboardContext.Provider>
        </SmartRequestQueueContext.Provider>
      </ReactQueryCacheProvider>
    </>
  );
};

export default App;
