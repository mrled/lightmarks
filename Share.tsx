/* The entrypoint for the share extension
 *
 * The share extension doesn't load your app through App.tsx, but through this file.
 * Be careful with the components you mount in this file.
 * I had weird errors when using components from a file that included
 * Switch and TextInput components wrapped by react-native-gesture-handler.
 * See the AddBookmark component for details.
 */

import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';

import {ShareMenuReactView} from 'react-native-share-menu';

import {AddBookmarkScreen} from 'components/AddBookmark';

const Share = () => {
  const [sharedData, setSharedData] = useState<string>('');
  const [sharedMimeType, setSharedMimeType] = useState<string>('');
  const [received, setReceived] = useState<boolean>(false);

  useEffect(() => {
    ShareMenuReactView.data().then((receivedData: any) => {
      console.log(`Share(): receivedData: ${JSON.stringify(receivedData)}`);
      setSharedData(receivedData.data);
      setSharedMimeType(receivedData.mimeType);
      setReceived(true);
    });
  }, []);

  if (!received) {
    return (
      <View>
        <Text>Receiving...</Text>
        <ActivityIndicator />
      </View>
    );
  } else {
    return (
      <AddBookmarkScreen
        dismiss={() => ShareMenuReactView.dismissExtension()}
        initialUri={sharedData}
      />
    );
  }
};

export default Share;
