/* A list of bookmarks with a title
 */

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StatusBar,
  SafeAreaView,
  Text,
  View,
  Pressable,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {AppStyles, BookmarkDynamicStyles, BookmarkStyles} from 'style/Styles';
import {FunctionalColors} from 'style/Colors';
import {PinboardBookmark} from 'lib/Pinboard/types';

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

  console.log(`BookmarkListItemView(): ${JSON.stringify(bookmark)}`);

  return (
    <View style={BookmarkStyles.listItemView}>
      <Pressable
        style={BookmarkDynamicStyles.listItemPressableLink}
        onPress={() => Linking.openURL(bookmark.uri)}>
        <Text style={BookmarkStyles.listItemTitle}>{bookmark.title}</Text>
        <Text style={BookmarkStyles.listItemLink}>{bookmark.uri}</Text>
      </Pressable>
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
      {bookmark.tags.length < 1 ? (
        <></>
      ) : (
        <Text>
          <Ionicons name="ios-pricetags" color={FunctionalColors.TagIcon} />{' '}
          {bookmark.tags.join(', ')}
        </Text>
      )}
    </View>
  );
};

interface BookmarkListViewProps {
  // A title for the view, displayed to the user
  title: string;

  /* A getter function that will return the required bookmarks wrapped by a promise.
   * Some examples:
   *  pinboard.feeds.unauthenticated.popular
   *  () => pinboard.feeds.unauthenticated.popular(count=1)
   */
  bookmarksGetter: () => Promise<any>;
}

export const BookmarkListView: React.FC<BookmarkListViewProps> = ({
  title,
  bookmarksGetter,
}) => {
  const [loadErr, setLoadErr] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<Array<any>>([]);

  const getBookmarks = () => {
    setLoadErr('');
    setLoading(true);
    bookmarksGetter()
      .then((result) => {
        // console.debug(
        //   `BookmarkListView:bookmarksGetter(): got result ${JSON.stringify(
        //     result,
        //   )}`,
        // );
        setLoadErr('');
        setLoading(false);
        setBookmarks(result);
      })
      .catch((err) => {
        console.error(
          `BookmarkListView:bookmarksGetter(): got error ${JSON.stringify(
            err,
          )}`,
        );
        setLoadErr(JSON.stringify(err));
        setLoading(false);
      });
  };
  useEffect(getBookmarks, []);

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
      <BookmarkList bookmarks={bookmarks} loading={loading} loadErr={loadErr} />
    </>
  );
};
