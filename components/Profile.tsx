/* Tab view for the logged in user
 */

import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StatusBar, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {StackNavigationProp} from '@react-navigation/stack';

import {BookmarkListView} from 'components/BookmarkList';
import {PinboardContext} from 'hooks/usePinboard';
import {AppStyles} from 'style/Styles';
import {NavigationList, NavigationListDestination} from './NavigationList';

const ProfileStack = createStackNavigator<ProfileStackParamList>();

type ProfileStackParamList = {
  Profile: undefined;
  'All Bookmarks': undefined;
  'Most Recent': undefined;
  'Bookmarks from Recent Day': undefined;
  'Last Update': undefined;
};

export const ProfileStackScreen: React.FC = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileRootScreen} />
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
 * ... this API might not be working?
 */
type MostRecentDayScreenProps = {};
const MostRecentDayScreen: React.FC<MostRecentDayScreenProps> = ({}) => {
  const {pinboard} = useContext(PinboardContext);
  const bookmarksGetter = () => pinboard.api.posts.get({});
  return <BookmarkListView title="Recent" bookmarksGetter={bookmarksGetter} />;
};

/* Last 30 most recent bookmarks
 * Just for testing
 */
type MostRecentScreenProps = {};
const MostRecentScreen: React.FC<MostRecentScreenProps> = ({}) => {
  const {pinboard} = useContext(PinboardContext);
  const bookmarksGetter = () => pinboard.api.posts.recent({count: 30});
  return <BookmarkListView title="Recent" bookmarksGetter={bookmarksGetter} />;
};

/* The date the Pinboard server last received an update
 */
type LastUpdateScreenProps = {};
const LastUpdateScreen: React.FC<LastUpdateScreenProps> = ({}) => {
  const {pinboard} = useContext(PinboardContext);
  const [lastUpdated, setLastUpdated] = useState<string>('Loading...');
  useEffect(() => {
    pinboard.api.posts
      .update()
      .then((date) =>
        setLastUpdated(
          `Last update to Pinboard account was on ${date.toString()}`,
        ),
      )
      .catch((error) => setLastUpdated(`error: ${error}`));
  }, [pinboard.api.posts]);

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
