import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import usePbApiTagsGet from 'hooks/pinboard/usePbApiTagsGet';
import {AppStyles} from 'style/Styles';

const DumbTagList: React.FC = () => {
  const {status, data, error, isFetching} = usePbApiTagsGet();
  console.log(
    [
      'Result of usePbApiTagsGet():',
      `status: ${status}`,
      `data: ${JSON.stringify(data)}`,
      `error: ${error}`,
      `isFetching: ${isFetching}`,
    ].join('\n'),
  );
  const header = () => {
    return <Text style={AppStyles.sectionTitle}>Tags</Text>;
  };
  if (isFetching) {
    return <ActivityIndicator />;
  } else if (error) {
    return <Text>ERROR: {error}</Text>;
  } else if (typeof data === undefined) {
    return <Text>No tags?</Text>;
  } else {
    return (
      <FlatList
        data={Object.keys(data || {})}
        renderItem={({item}) => {
          const tagName = item !== '' ? item : '(no tags)';
          return (
            <View>
              <Text>{tagName}</Text>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={header}
      />
    );
  }
};

const DumbTagView: React.FC = () => {
  // const {pinboard} = useContext(PinboardContext);

  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={AppStyles.screenRootScrollView}>
          <View style={AppStyles.body}>
            <View style={AppStyles.sectionContainer}>
              <View style={AppStyles.listTagsButtonContainer}>
                <Text>List of Pinboard tags in your account</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <DumbTagList />
    </>
  );
};

export default DumbTagView;
