import React, {useContext, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, ScrollView, Text, View} from 'react-native';

import {AppConfigurationContext} from 'hooks/useAppConfiguration';
import {AppStyles} from 'style/Styles';
import {getCredential, getSetting} from 'lib/storage';

class DebugDatum {
  public label: string;
  public value: string;
  constructor(label: string, value: any) {
    this.label = label;
    this.value = JSON.stringify(value);
  }
}

const DebugInfo = () => {
  const {apiAuthTokenCredential, productionMode, feedsTokenSecret} = useContext(
    AppConfigurationContext,
  );

  const [storageMode, setStorageMode] = useState('');
  const [storageUser, setStorageUser] = useState('');
  const [storageApiToken, setStorageApiToken] = useState('');
  const [storageRssSecret, setStorageRssSecret] = useState('');

  useEffect(() => {
    getCredential('PinboardApiTokenSecretCredential').then((c) => {
      setStorageUser(c ? c.username : 'empty');
      setStorageApiToken(c ? c.password : 'empty');
    });
    getCredential('PinboardFeedsRssSecretCredential').then((c) => {
      setStorageRssSecret(c ? c.password : 'empty');
    });
    getSetting('PinboardMode').then((s) => setStorageMode(s));
  }, []);

  const debugData = [
    new DebugDatum('Pinboard object mode', productionMode),
    new DebugDatum('Pinboard object user', apiAuthTokenCredential?.username),
    new DebugDatum(
      'Pinboard object API secret',
      apiAuthTokenCredential?.password,
    ),
    new DebugDatum('Pinboard object RSS secret', feedsTokenSecret),
    new DebugDatum('Storage mode', storageMode),
    new DebugDatum('Storage user', storageUser),
    new DebugDatum('Storage API token', storageApiToken),
    new DebugDatum('Storage RSS secret', storageRssSecret),
  ];

  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={AppStyles.screenRootScrollView}>
          <View style={AppStyles.body}></View>
        </ScrollView>
      </SafeAreaView>
      <FlatList
        data={debugData}
        renderItem={({item}) => {
          return (
            <View style={{flexDirection: 'row'}}>
              <Text style={{backgroundColor: 'tomato'}}>{item.label}</Text>
              <Text> {typeof item.value} </Text>
              <Text style={{backgroundColor: 'goldenrod'}}>
                {item.value || '<falsey>'}
              </Text>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={<Text>Debug info</Text>}
      />
    </>
  );
};

export default DebugInfo;
