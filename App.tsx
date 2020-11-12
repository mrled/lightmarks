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
import Pinboard from 'node-pinboard';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import FauxPinboard from './FauxPinboard';

declare const global: {HermesInternal: null | {}};

interface TagListProps {
  tags: Array<string>;
  loading: boolean;
}

const TagList: React.FC<TagListProps> = ({tags, loading}) => {
  const header = () => {
    return <Text style={styles.sectionTitle}>Tags</Text>;
  };
  return loading ? (
    <ActivityIndicator />
  ) : (
    <FlatList
      data={tags}
      renderItem={({item}) => {
        const tagName = item !== '' ? item : '(no tags)';
        return (
          <View>
            <Text>{tagName}</Text>
          </View>
        );
      }}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={header}
    />
  );
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<Array<string>>([]);
  const token = `${Config.PINBOARD_API_USER}:${Config.PINBOARD_API_SECRET}`;
  console.debug(`Using token: ${token}`);

  const modeText = Config.DATA === 'mock' ? 'mock' : 'production';
  const pinboard =
    Config.DATA === 'mock' ? new FauxPinboard(token) : new Pinboard(token);

  const getTags = () => {
    setLoading(true);
    pinboard
      .getTags({})
      .then((result: Object) => {
        console.log('Found my result:');
        console.log(result);
        setTags(Object.keys(result));
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error('Could not retrieve tags');
        console.error(err);
      });
  };

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
                This app is running in {modeText} mode.
              </Text>
              <Text style={styles.sectionDescription}>
                Logging in with an API token for user {Config.PINBOARD_API_USER}
              </Text>
              <View style={styles.listTagsButtonContainer}>
                <Button
                  onPress={() => {
                    getTags();
                  }}
                  title="List Pinboard tags"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <TagList tags={tags} loading={loading} />
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
