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
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {AppStyles, BookmarkStyles} from 'lib/Styles';

interface BookmarkListItemProps {
  item: any; // FIXME: any
}
const BookmarkListItem: React.FC<BookmarkListItemProps> = ({item}) => {
  // console.debug(`Rendering bookmark: ${JSON.stringify(item)}`);

  // const itemDate = new Date(item.dt);
  // console.log(
  //   `Item date ${item.dt} parses as ${itemDate.toLocaleString('en-US', {
  //     timeZone: 'CST',
  //   })}`,
  // );

  const pbUsername = `u:${item.a}`;
  const pbUserUri = `https://m.pinboard.in/${pbUsername}`;

  return (
    <View style={BookmarkStyles.listItemView}>
      <Text style={BookmarkStyles.listItemTitle}>{item.d}</Text>
      <Text
        style={BookmarkStyles.listItemAuthorDate}
        onPress={() => Linking.openURL(pbUserUri)}>
        from u:{item.a}
      </Text>
      <Text
        style={BookmarkStyles.listItemLink}
        onPress={() => Linking.openURL(item.u)}>
        {item.u}
      </Text>
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

interface BookmarkListProps {
  bookmarks: Array<any>;
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
      <BookmarkList bookmarks={bookmarks} loading={loading} loadErr={loadErr} />
    </>
  );
};
