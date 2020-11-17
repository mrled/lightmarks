import React, {useContext} from 'react';
import {Button, SafeAreaView, ScrollView, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {StackNavigationProp} from '@react-navigation/stack';

import {BookmarkListView} from 'components/BookmarkList';
import {PinboardContext} from 'hooks/usePinboard';
import Styles from 'lib/Styles';

type DiscoverStackParamList = {
  Discover: undefined;
  Popular: undefined;
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
          style={Styles.scrollView}>
          <View style={Styles.body}>
            <View style={Styles.sectionContainer}>
              <Text style={Styles.sectionTitle}>Discover</Text>
            </View>
            <View style={Styles.sectionContainer}>
              <Text style={Styles.sectionDescription}>Community bookmarks</Text>
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
    </DiscoverStack.Navigator>
  );
};

type PopularScreenProps = {
  // navigation: StackNavigationProp<DiscoverStackParamList, 'Popular'>;
};

// const PopularScreen: React.FC<PopularScreenProps> = ({navigation}) => {
const PopularScreen: React.FC<PopularScreenProps> = ({}) => {
  const {pinboard} = useContext(PinboardContext);
  return (
    <BookmarkListView
      title="Popular"
      bookmarksGetter={() => pinboard.feeds.unauthenticated.popular(400)}
    />
  );
};
