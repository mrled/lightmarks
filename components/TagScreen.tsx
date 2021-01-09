/* Tag manager for the logged in user
 */

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import {BookmarkList} from 'components/BookmarkList';
import {AppStyles, TagListStyles} from 'style/Styles';

// import Ionicons from 'react-native-vector-icons/Ionicons';
import {TagWithCount, TTagsWithCountToTagWithCountArr} from 'lib/Pinboard';
import usePbApiTagsGet from 'hooks/pinboard/usePbApiTagsGet';
import usePbApiPostsGet from 'hooks/pinboard/usePbApiPostsGet';

const TagManagerStack = createStackNavigator();

type TagManagerStackParamList = {
  'Tag Manager': {};
  'Single Tag': {name: string};
};

type TagManagerRootScreenNavigationProp = StackNavigationProp<
  TagManagerStackParamList,
  'Tag Manager'
>;

export const TagManagerStackScreen: React.FC<TagManagerStackParamList> = () => {
  return (
    <TagManagerStack.Navigator>
      <TagManagerStack.Screen
        name="Tag Manager"
        component={TagManagerRootScreen}
      />
      <TagManagerStack.Screen name="Single Tag" component={TagScreen} />
    </TagManagerStack.Navigator>
  );
};

type TagScreenRouteProp = RouteProp<TagManagerStackParamList, 'Single Tag'>;
type TagScreenProps = {
  route: TagScreenRouteProp;
  // navigation: TagManagerRootScreenNavigationProp;
};
export const TagScreen: React.FC<TagScreenProps> = ({route}) => {
  const {name} = route.params;
  const result = usePbApiPostsGet({tag: [name]});
  console.log(`Inside tag screen for tag ${name}`);
  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={AppStyles.screenRootScrollView}>
          <View style={AppStyles.body}>
            <View style={AppStyles.sectionContainer}>
              <Text style={AppStyles.sectionTitle}>
                {result.result.isLoading
                  ? `Loading bookmarks for tag "${name}"`
                  : `Bookmarks tagged "${name}"`}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <BookmarkList
        bookmarks={result.processed}
        loading={result.result.isLoading}
        loadErr={result.result.error as string}
      />
    </>
  );
};

interface TagListItemViewProps {
  tag: TagWithCount;
  navigation: TagManagerRootScreenNavigationProp;
}
const TagListItemView: React.FC<TagListItemViewProps> = ({tag, navigation}) => {
  const tagName = tag.tag ? tag.tag : '(Untagged)';
  const bookmarkNoun = tag.count === 1 ? 'bookmark' : 'bookmarks';
  return (
    <View style={TagListStyles.listItem}>
      <Pressable onPress={() => navigation.push('Single Tag', {name: tag.tag})}>
        <Text style={TagListStyles.tagName}>{tagName}</Text>
        <Text style={TagListStyles.bookmarkCount}>
          {tag.count} {bookmarkNoun}
        </Text>
      </Pressable>
    </View>
  );
};

interface TagListProps {
  tags: TagWithCount[];
  loading: boolean;
  loadErr: string;
  navigation: TagManagerRootScreenNavigationProp;
}
const TagList: React.FC<TagListProps> = ({
  tags,
  loading,
  loadErr,
  navigation,
}) => {
  if (loading) {
    return <ActivityIndicator />;
  } else if (loadErr) {
    return (
      <View>
        <Text>{loadErr}</Text>
      </View>
    );
  } else {
    return (
      <FlatList
        data={tags}
        renderItem={(item) =>
          TagListItemView({tag: item.item, navigation: navigation})
        }
        keyExtractor={(item) => item.tag}
      />
    );
  }
};

interface TagManagerRootScreenProps {
  navigation: TagManagerRootScreenNavigationProp;
}
export const TagManagerRootScreen: React.FC<TagManagerRootScreenProps> = ({
  navigation,
}) => {
  const tagsResult = usePbApiTagsGet();
  const tags = TTagsWithCountToTagWithCountArr(tagsResult.data);
  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={AppStyles.screenRootScrollView}>
          <View style={AppStyles.body}>
            <View style={AppStyles.sectionContainer}>
              <Text style={AppStyles.sectionTitle}>Tag Manager</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <TagList
        tags={tags}
        loading={tagsResult.isLoading}
        loadErr={tagsResult.error as string}
        navigation={navigation}
      />
    </>
  );
};
