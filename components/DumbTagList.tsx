import React from 'react';
import {ActivityIndicator, FlatList, View, Text} from 'react-native';

import {AppStyles} from 'style/Styles';

interface DumbTagListProps {
  tags: Array<string>;
  loading: boolean;
}

const DumbTagList: React.FC<DumbTagListProps> = ({tags, loading}) => {
  const header = () => {
    return <Text style={AppStyles.sectionTitle}>Tags</Text>;
  };
  return loading ? (
    <ActivityIndicator />
  ) : (
    <FlatList
      data={tags}
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
};

export default DumbTagList;
