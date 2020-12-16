import React from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {StackNavigationProp} from '@react-navigation/stack';

import {BookmarkListView} from 'components/BookmarkList';
import {AppStyles} from 'style/Styles';
import {NavigationListDestination, NavigationList} from './NavigationList';
import usePbFeedsUnauthPopular from 'hooks/pinboard/usePbFeedsUnauthPopular';
import usePbFeedsUnauthRecent from 'hooks/pinboard/usePbFeedsUnauthRecent';

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
  const popular = usePbFeedsUnauthPopular({count: 400});
  return (
    <BookmarkListView
      title="Popular"
      bookmarks={popular.processed !== undefined ? popular.processed : []}
      isLoading={popular.result.isLoading}
      error={popular.result.error}
    />
  );
};

type RecentScreenProps = {};
const RecentScreen: React.FC<RecentScreenProps> = ({}) => {
  const recent = usePbFeedsUnauthRecent({count: 400});
  return (
    <BookmarkListView
      title="Recent"
      bookmarks={recent.processed !== undefined ? recent.processed : []}
      isLoading={recent.result.isLoading}
      error={recent.result.error}
    />
  );
};
