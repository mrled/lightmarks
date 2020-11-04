/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import Config from 'react-native-config';

import {Colors} from 'react-native/Libraries/NewAppScreen';

declare const global: {HermesInternal: null | {}};

const PINBOARD_URI_BASE = 'https://api.pinboard.in/v1';

const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

const pinboard = async (method: string, token: string) => {
  const uri = `${PINBOARD_URI_BASE}/${method}?format=json&auth_token=${token}`;
  let response = await fetch(uri);
  let backoff = 10;
  const maxtries = 5;
  let thistry = 0;
  while (!response.ok) {
    console.error('Response not ok:');
    console.error(response);
    if (thistry > maxtries) {
      console.error(`Exceeded max tries of ${maxtries}, returning nothing lol`);
      return {};
    }
    thistry++;
    console.log(`Sleeping for ${backoff} seconds...`);
    sleep(backoff * 1000);
    backoff = 2 * backoff;
    response = await fetch(uri);
  }
  console.debug('Reponse was ok:');
  console.debug(response);
  const json = await response.json();
  console.debug('JSON response:');
  console.debug(json);
  return json;
};

const getTagsAsync = async (token: string, setLoading, setTags) => {
  try {
    setLoading(true);
    const tags = await pinboard('tags/get', token);
    setLoading(false);
    setTags(Object.keys(tags));
  } catch (error) {
    setLoading(false);
    console.error(error);
  }
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const token = `${Config.PINBOARD_API_USER}:${Config.PINBOARD_API_SECRET}`;
  console.debug(`Using token: ${token}`);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Welcome to betterpin</Text>
              <Text style={styles.sectionDescription}>
                Here is where there will be a UI for logging in or something
              </Text>
              <Text style={styles.sectionDescription}>
                Logging in with an API token for user {Config.PINBOARD_API_USER}
              </Text>
              <View style={styles.listTagsButtonContainer}>
                <Button
                  onPress={() => {
                    getTagsAsync(token, setLoading, setTags);
                  }}
                  title="List Pinboard tags"
                />
              </View>
              <Text style={styles.sectionTitle}>Tags</Text>
              {loading ? (
                <ActivityIndicator />
              ) : (
                <SafeAreaView>
                  <FlatList
                    data={tags}
                    renderItem={({item}) => (
                      <View>
                        <Text>{item}</Text>
                      </View>
                    )}
                  />
                </SafeAreaView>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  listTagsButtonContainer: {
    marginTop: 32,
    backgroundColor: '#2196F3',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
