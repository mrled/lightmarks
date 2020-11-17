/* A list of bookmarks with a title
 */

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {WebView} from 'react-native-webview';

import {AppStyles, BookmarkStyles} from 'lib/Styles';

interface BookmarkListItemProps {
  item: any; // FIXME: any
}

/* Wrapper function to return a BookmarkListItem component with built in navigation
 */
const BookmarkListItemWithNav: (navigation: any) => BookmarkListItem = (
  navigation,
) => {
  const BookmarkListItem: React.FC<BookmarkListItemProps> = ({item}) => {
    // console.debug(`Rendering bookmark: ${JSON.stringify(item)}`);

    // const itemDate = new Date(item.dt);
    // console.log(
    //   `Item date ${item.dt} parses as ${itemDate.toLocaleString('en-US', {
    //     timeZone: 'CST',
    //   })}`,
    // );

    const pbUsername = `u:${item.a}`;
    const pbUserUri = `https://pinboard.in/${pbUsername}`;

    return (
      <View style={BookmarkStyles.listItemView}>
        <Text style={BookmarkStyles.listItemTitle}>{item.d}</Text>
        <Text
          style={BookmarkStyles.listItemAuthorDate}
          onPress={() =>
            navigation.navigate('WebView', {params: {uri: pbUserUri}})
          }>
          from {pbUsername}
        </Text>
        <Text style={BookmarkStyles.listItemLink}>{item.u}</Text>
        {item.n === '' ? (
          <></>
        ) : (
          <Text style={BookmarkStyles.listItemExtendedDesc}>{item.n}</Text>
        )}
        {item.t.length === 1 && item.t[0] === '' ? (
          <></>
        ) : (
          <Text>
            <Ionicons name="ios-pricetags" color="tomato" /> {item.t.join(', ')}
          </Text>
        )}
      </View>
    );
  };

  return BookmarkListItem;
};

interface BookmarkListProps {
  bookmarks: Array<any>;
  loading: boolean;
  loadErr: string;
  navigation: any;
}

const BookmarkList: React.FC<BookmarkListProps> = ({
  bookmarks,
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
    const BookmarkListItem = BookmarkListItemWithNav(navigation);
    return (
      <FlatList
        data={bookmarks}
        renderItem={BookmarkListItem}
        keyExtractor={(_item, index) => index.toString()}
      />
    );
  }
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

  // The navigation object
  navigation: any; // FIXME: type check
}

export const BookmarkListView: React.FC<BookmarkListViewProps> = ({
  title,
  bookmarksGetter,
  navigation,
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
        console.debug(
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
      <BookmarkList
        bookmarks={bookmarks}
        loading={loading}
        loadErr={loadErr}
        navigation={navigation}
      />
    </>
  );
};
