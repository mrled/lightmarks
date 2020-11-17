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

import Styles from 'lib/Styles';

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
        renderItem={({item}) => {
          console.log(`Rendering bookmark: ${JSON.stringify(item)}`);
          return (
            <View style={Styles.listItemView}>
              <Text style={Styles.listItemTitle}>{item.d}</Text>
              <Text>
                from {item.a} on {item.dt}
              </Text>
              <Text style={{color: 'blue'}}>{item.u}</Text>
              {item.n === '' ? (
                <></>
              ) : (
                <Text
                  style={{
                    backgroundColor: 'antiquewhite',
                    margin: 12,
                    padding: 4,
                  }}>
                  {item.n}
                </Text>
              )}
              <Text>Tags: {item.t.join(', ')}</Text>
              {/* <Text>{JSON.stringify(item)}</Text> */}
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
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
        console.debug(
          `BookmarkListView:bookmarksGetter(): got result ${JSON.stringify(
            result,
          )}`,
        );
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
        <View style={Styles.body}>
          <View style={Styles.sectionContainer}>
            <Text style={Styles.sectionTitle}>{title}</Text>
          </View>
        </View>
      </SafeAreaView>
      <BookmarkList bookmarks={bookmarks} loading={loading} loadErr={loadErr} />
    </>
  );
};
