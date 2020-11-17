import React, {useContext} from 'react';
import {Button, Link, SafeAreaView, ScrollView, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {StackNavigationProp} from '@react-navigation/stack';
import {WebView} from 'react-native-webview';

import {BookmarkListView} from 'components/BookmarkList';
import {PinboardContext} from 'hooks/usePinboard';
import {AppStyles} from 'lib/Styles';

type DiscoverStackParamList = {
  Discover: undefined;
  Popular: undefined;
  SimpleWebView: {uri: string};
};

const DiscoverStack = createStackNavigator<DiscoverStackParamList>();

type DiscoverScreenProps = {
  navigation: StackNavigationProp<DiscoverStackParamList, 'Discover'>;
};

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({navigation}) => {
  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={AppStyles.scrollView}>
          <View style={AppStyles.body}>
            <View style={AppStyles.sectionContainer}>
              <Text style={AppStyles.sectionTitle}>Discover</Text>
            </View>
            <View style={AppStyles.sectionContainer}>
              <Text style={AppStyles.sectionDescription}>
                Community bookmarks
              </Text>
              <Button
                title="Popular"
                onPress={() => navigation.navigate('Popular')}
              />
              {/* <CommunityBookmarksSection /> */}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export const DiscoverStackScreen: React.FC = () => {
  return (
    <DiscoverStack.Navigator>
      <DiscoverStack.Screen name="Discover" component={DiscoverScreen} />
      <DiscoverStack.Screen name="Popular" component={PopularScreen} />
      <DiscoverStack.Screen
        name="SimpleWebView"
        component={SimpleWebViewScreen}
      />
    </DiscoverStack.Navigator>
  );
};

type PopularScreenProps = {
  navigation: StackNavigationProp<DiscoverStackParamList, 'Popular'>;
};

const PopularScreen: React.FC<PopularScreenProps> = ({navigation}) => {
  // const PopularScreen: React.FC<PopularScreenProps> = ({}) => {
  const {pinboard} = useContext(PinboardContext);
  return (
    <BookmarkListView
      title="Popular"
      bookmarksGetter={() => pinboard.feeds.unauthenticated.popular(400)}
      navigation={navigation}
    />
  );
};

type SimpleWebViewScreenProps = {
  navigation: StackNavigationProp<DiscoverStackParamList, 'SimpleWebView'>;
};
const SimpleWebViewScreen: React.FC<SimpleWebviewScreenProps> = ({
  navigation,
}) => {
  return <WebView />;
};
