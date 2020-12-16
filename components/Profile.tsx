/* Tab view for the logged in user
 */

import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';

import {BookmarkListView} from 'components/BookmarkList';
import {AppStyles} from 'style/Styles';
import {NavigationList, NavigationListDestination} from './NavigationList';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {AddBookmarkScreenWithBack} from './AddBookmark';
import usePbApiPostsAll from 'hooks/pinboard/usePbApiPostsAll';
import usePbApiPostsGet from 'hooks/pinboard/usePbApiPostsGet';
import usePbApiPostsRecent from 'hooks/pinboard/usePbApiPostsRecent';
import usePbApiPostsUpdate from 'hooks/pinboard/usePbApiPostsUpdate';

const ProfileStack = createStackNavigator<ProfileStackParamList>();

type ProfileStackParamList = {
  Profile: undefined;
  'All Bookmarks': undefined;
  'Most Recent': undefined;
  'Bookmarks from Recent Day': undefined;
  'Last Update': undefined;
  'Add Bookmark': undefined;
};

const AddBookmarkHeaderButton: React.FC = () => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={AppStyles.headerRightIconButton}
      onPress={() => navigation.navigate('Add Bookmark')}>
      <Ionicons name="add" color="tomato" size={32} />
    </Pressable>
  );
};

export const ProfileStackScreen: React.FC = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileRootScreen}
        options={{
          headerRight: () => <AddBookmarkHeaderButton />,
        }}
      />
      <ProfileStack.Screen
        name="All Bookmarks"
        component={AllBookmarksScreen}
      />
      <ProfileStack.Screen name="Most Recent" component={MostRecentScreen} />
      <ProfileStack.Screen
        name="Bookmarks from Recent Day"
        component={MostRecentDayScreen}
      />
      <ProfileStack.Screen name="Last Update" component={LastUpdateScreen} />
      <ProfileStack.Screen
        name="Add Bookmark"
        component={AddBookmarkScreenWithBack}
      />
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
          style={AppStyles.screenRootScrollView}>
          <View style={AppStyles.body}>
            <View style={AppStyles.sectionContainer}>
              <Text style={AppStyles.sectionTitle}>Profile</Text>
            </View>
            <View style={AppStyles.sectionContainer}>
              <NavigationList
                title="Your bookmarks"
                destinations={[
                  new NavigationListDestination(
                    'Last updated date',
                    'calendar',
                    () => navigation.navigate('Last Update'),
                  ),
                  new NavigationListDestination(
                    'Bookmarks from most recent date',
                    'today',
                    () => navigation.navigate('Bookmarks from Recent Day'),
                  ),
                  new NavigationListDestination(
                    'All bookmarks',
                    'bookmarks',
                    () => navigation.navigate('All Bookmarks'),
                  ),
                  new NavigationListDestination(
                    'Most recent bookmarks',
                    'time',
                    () => navigation.navigate('Most Recent'),
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
  const posts = usePbApiPostsAll();
  return (
    <BookmarkListView
      title="All bookmarks"
      bookmarks={posts.processed}
      isLoading={posts.result.isLoading}
      error={posts.result.error}
    />
  );
};

/* All bookmarks from the most recent day any bookmark was added
 * Just for testing
 * ... this API might not be working?
 */
type MostRecentDayScreenProps = {};
const MostRecentDayScreen: React.FC<MostRecentDayScreenProps> = ({}) => {
  const posts = usePbApiPostsGet();
  return (
    <BookmarkListView
      title="Bookmarks from most recent day"
      bookmarks={posts.processed}
      isLoading={posts.result.isLoading}
      error={posts.result.error}
    />
  );
};

/* Last 30 most recent bookmarks
 * Just for testing
 */
type MostRecentScreenProps = {};
const MostRecentScreen: React.FC<MostRecentScreenProps> = ({}) => {
  const posts = usePbApiPostsRecent();
  return (
    <BookmarkListView
      title="Most recent bookmarks"
      bookmarks={posts.processed}
      isLoading={posts.result.isLoading}
      error={posts.result.error}
    />
  );
};

/* The date the Pinboard server last received an update
 */
type LastUpdateScreenProps = {};
const LastUpdateScreen: React.FC<LastUpdateScreenProps> = ({}) => {
  const date = usePbApiPostsUpdate();
  console.debug(date);
  const lastUpdated =
    date.processed && !date.result.isError
      ? `Last update to Pinboard account was on ${date.processed.toString()}`
      : `Error retrieving last update to Pinboard account: ${date.result.error}`;
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={AppStyles.body}>
          <View style={AppStyles.sectionContainer}>
            <Text style={AppStyles.sectionTitle}>Last account update</Text>
            <Text style={AppStyles.sectionDescription}>{lastUpdated}</Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
