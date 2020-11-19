import React, {useContext} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {StackNavigationProp} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {BookmarkListView} from 'components/BookmarkList';
import {PinboardContext} from 'hooks/usePinboard';
import {AppStyles} from 'style/Styles';
import {FlatList} from 'react-native-gesture-handler';
import {Pressable} from 'react-native';
import {FunctionalColors, NamedColors} from 'style/Colors';

type DiscoverStackParamList = {
  Discover: undefined;
  Popular: undefined;
  Recent: undefined;
};

const DiscoverStack = createStackNavigator<DiscoverStackParamList>();

type CommunitySectionListProps = {
  navigation: StackNavigationProp<DiscoverStackParamList, 'Discover'>;
};
const CommunitySectionList: React.FC<CommunitySectionListProps> = ({
  navigation,
}) => {
  const communityListItems: {title: string; onPress: () => void}[] = [
    {title: 'Popular', onPress: () => navigation.navigate('Popular')},
    {title: 'Recent', onPress: () => navigation.navigate('Recent')},
  ];
  return (
    <FlatList
      data={communityListItems}
      renderItem={({item}) => (
        <Pressable onPress={item.onPress}>
          <Text>{item.title}</Text>
        </Pressable>
      )}
      keyExtractor={(item) => item.title}
      ListHeaderComponent={
        <Text style={AppStyles.sectionDescription}>Community bookmarks</Text>
      }
    />
  );
};

const PressableInListStyle = StyleSheet.create({
  itemIcon: {
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 18,
  },
  sectionDescriptionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    color: 'gray',
  },
  sectionDescriptionView: {
    borderBottomWidth: 1,
    paddingBottom: 15,
  },
});
const PressableInListDynamicStyle = {
  pressable: ({pressed}) => {
    return {
      backgroundColor: pressed ? 'lightgray' : 'white',
      paddingVertical: 15,
      borderBottomWidth: 1,
      flexDirection: 'row',
    };
  },
};

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
              <View style={PressableInListStyle.sectionDescriptionView}>
                <Text style={PressableInListStyle.sectionDescriptionText}>
                  Community bookmarks
                </Text>
              </View>
              <Pressable
                style={PressableInListDynamicStyle.pressable}
                onPress={() => navigation.navigate('Popular')}>
                <Ionicons
                  style={PressableInListStyle.itemIcon}
                  name="trending-up"
                  color={FunctionalColors.NavigationListItemIcon}
                  size={18}
                />
                <Text style={PressableInListStyle.itemTitle}>Popular</Text>
              </Pressable>
              <Pressable
                style={PressableInListDynamicStyle.pressable}
                onPress={() => navigation.navigate('Recent')}>
                <Ionicons
                  style={PressableInListStyle.itemIcon}
                  name="time"
                  color={FunctionalColors.NavigationListItemIcon}
                  size={18}
                />
                <Text style={PressableInListStyle.itemTitle}>Recent</Text>
              </Pressable>
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
