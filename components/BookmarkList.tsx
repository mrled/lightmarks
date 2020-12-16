/* A list of bookmarks with a title
 */

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StatusBar,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import PressableAnchor from 'components/PressableAnchor';
import {AppStyles, BookmarkStyles} from 'style/Styles';
import {FunctionalColors} from 'style/Colors';
import {PinboardBookmark} from 'lib/Pinboard/types';

const Styles = StyleSheet.create({
  flexDirectionRow: {flexDirection: 'row'},
  tagIconCell: {
    marginRight: 7,
    transform: [{translateY: 2}], // The icon looks off when its not moved down a bit
  },
});

interface BookmarkListProps {
  bookmarks: Array<PinboardBookmark>;
  loading: boolean;
  loadErr: string;
  // navigator: any;
}

const BookmarkList: React.FC<BookmarkListProps> = ({
  bookmarks,
  loading,
  loadErr,
  // navigator,
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
        data={bookmarks}
        renderItem={(item) => BookmarkListItemView({bookmark: item.item})}
        keyExtractor={(_item, index) => index.toString()}
      />
    );
  }
};

interface TagsListProps {
  tags: string[];
}
const TagsListView: React.FC<TagsListProps> = ({tags}) => {
  return (
    <View style={Styles.flexDirectionRow}>
      {/* <View style={[AppStyles.flex, adjustIconYPos.s]}> */}
      <View style={Styles.tagIconCell}>
        <Ionicons name="pricetags" color={FunctionalColors.TagIcon} />
      </View>
      <View>
        <Text>{tags.join(', ')}</Text>
      </View>
    </View>
  );
};

const UnreadBadge = () => {
  return (
    <>
      <Text style={BookmarkStyles.unreadBadgeText}>Unread</Text>
    </>
  );
};

interface BookmarkListItemViewProps {
  bookmark: PinboardBookmark;
}
const BookmarkListItemView: React.FC<BookmarkListItemViewProps> = ({
  bookmark,
}) => {
  // console.debug(`Rendering bookmark: ${JSON.stringify(item)}`);

  // const itemDate = new Date(item.dt);
  // console.log(
  //   `Item date ${item.dt} parses as ${itemDate.toLocaleString('en-US', {
  //     timeZone: 'CST',
  //   })}`,
  // );

  const pbUsername = `u:${bookmark.user}`;
  const pbUserUri = `https://m.pinboard.in/${pbUsername}`;
  const outerViewStyle =
    typeof bookmark.shared !== undefined && bookmark.shared
      ? BookmarkStyles.listItemPublicView
      : BookmarkStyles.listItemPrivateView;

  console.log(`BookmarkListItemView(): ${JSON.stringify(bookmark)}`);

  return (
    <View style={outerViewStyle}>
      <PressableAnchor href={bookmark.uri}>
        <Text style={BookmarkStyles.listItemTitle}>{bookmark.title}</Text>
        <Text style={BookmarkStyles.listItemLink}>{bookmark.uri}</Text>
      </PressableAnchor>
      <Text
        style={BookmarkStyles.listItemAuthorDate}
        onPress={() => Linking.openURL(pbUserUri)}>
        from {pbUsername}
      </Text>
      {bookmark.extendedDescription === '' ? (
        <></>
      ) : (
        <View style={BookmarkStyles.listItemExtendedDescView}>
          <Text style={BookmarkStyles.listItemExtendedDescText}>
            {bookmark.extendedDescription}
          </Text>
        </View>
      )}
      {bookmark.tags.length < 1 ? <></> : <TagsListView tags={bookmark.tags} />}
      {bookmark.toread ? <UnreadBadge /> : <></>}
    </View>
  );
};

interface BookmarkListViewProps {
  // A title for the view, displayed to the user
  title: string;
  // A list of PinboardBookmark objects
  bookmarks: PinboardBookmark[];
  isLoading: boolean;
  error: any;
}

export const BookmarkListView: React.FC<BookmarkListViewProps> = ({
  title,
  bookmarks,
  isLoading,
  error,
}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={AppStyles.body}>
          <View style={AppStyles.sectionContainer}>
            <Text style={AppStyles.sectionTitle}>{title}</Text>
          </View>
        </View>
      </SafeAreaView>
      <BookmarkList bookmarks={bookmarks} loading={isLoading} loadErr={error} />
    </>
  );
};
