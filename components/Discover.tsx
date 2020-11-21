import React, {useContext} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {StackNavigationProp} from '@react-navigation/stack';

import {BookmarkListView} from 'components/BookmarkList';
import {PinboardContext} from 'hooks/usePinboard';
import {AppStyles} from 'style/Styles';
import {NavigationListDestination, NavigationList} from './NavigationList';

type DiscoverStackParamList = {
  Discover: undefined;
  Popular: undefined;
  Recent: undefined;
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
          style={AppStyles.screenRootScrollView}>
          <View style={AppStyles.body}>
            <View style={AppStyles.sectionContainer}>
              <Text style={AppStyles.sectionTitle}>Discover</Text>
            </View>
            <View style={AppStyles.sectionContainer}>
              <NavigationList
                title="Community bookmarks"
                destinations={[
                  new NavigationListDestination('Popular', 'trending-up', () =>
                    navigation.navigate('Popular'),
                  ),
                  new NavigationListDestination('Recent', 'time', () =>
                    navigation.navigate('Recent'),
                  ),
                ]}
              />
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
      <DiscoverStack.Screen name="Recent" component={RecentScreen} />
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

type RecentScreenProps = {};
const RecentScreen: React.FC<RecentScreenProps> = ({}) => {
  const {pinboard} = useContext(PinboardContext);
  return (
    <BookmarkListView
      title="Recent"
      bookmarksGetter={() => pinboard.feeds.unauthenticated.recent(400)}
    />
  );
};
