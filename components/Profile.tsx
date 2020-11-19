/* Tab view for the logged in user
 */

import React, {useContext} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {StackNavigationProp} from '@react-navigation/stack';

import {BookmarkListView} from 'components/BookmarkList';
import {PinboardContext} from 'hooks/usePinboard';
import {AppStyles} from 'style/Styles';
import {NavigationList, NavigationListDestination} from './NavigationList';

const ProfileStack = createStackNavigator<ProfileStackParamList>();

type ProfileStackParamList = {
  Profile: undefined;
  AllBookmarks: undefined;
  MostRecent: undefined;
};

export const ProfileStackScreen: React.FC = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileRootScreen} />
      <ProfileStack.Screen name="AllBookmarks" component={AllBookmarksScreen} />
      <ProfileStack.Screen name="MostRecent" component={MostRecentScreen} />
    </ProfileStack.Navigator>
  );
};

type ProfileRootScreenProps = {
  navigation: StackNavigationProp<ProfileStackParamList, 'Profile'>;
};
export const ProfileRootScreen: React.FC<ProfileRootScreenProps> = ({
  navigation,
}) => {
  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={AppStyles.scrollView}>
          <View style={AppStyles.body}>
            <View style={AppStyles.sectionContainer}>
              <Text style={AppStyles.sectionTitle}>Profile</Text>
            </View>
            <View style={AppStyles.sectionContainer}>
              <NavigationList
                title="Your bookmarks"
                destinations={[
                  new NavigationListDestination(
                    'All bookmarks',
                    'bookmarks',
                    () => navigation.navigate('AllBookmarks'),
                  ),
                  new NavigationListDestination(
                    'Most recent bookmarks',
                    'time',
                    () => navigation.navigate('MostRecent'),
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

type AllBookmarksScreenProps = {};
export const AllBookmarksScreen: React.FC<AllBookmarksScreenProps> = () => {
  const {pinboard} = useContext(PinboardContext);
  return (
    <BookmarkListView
      title="All bookmarks"
      bookmarksGetter={() => pinboard.api.posts.all({})}
    />
  );
};

/* All bookmarks from the most recent day any bookmark was added
 * Just for testing
 */
type MostRecentScreenProps = {};
const MostRecentScreen: React.FC<MostRecentScreenProps> = ({}) => {
  const {pinboard} = useContext(PinboardContext);
  return (
    <BookmarkListView
      title="Recent"
      bookmarksGetter={() => pinboard.api.posts.recent({})}
    />
  );
};
