import React, {useContext, useState} from 'react';
import {Button, SafeAreaView, ScrollView, View} from 'react-native';

import DumbTagList from 'components/DumbTagList';
import {PinboardContext} from 'hooks/usePinboard';
import {Pinboard} from 'lib/Pinboard';
import {AppStyles} from 'style/Styles';

interface DumbTagViewProps {
  pinboard: Pinboard;
}

const DumbTagView: React.FC<DumbTagViewProps> = () => {
  const {pinboard} = useContext(PinboardContext);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<Array<string>>([]);

  const getTags = () => {
    setLoading(true);
    pinboard.api.tags
      .get()
      .then((value: object) => {
        console.log('Found my result:');
        console.log(value);
        setTags(Object.keys(value));
        setLoading(false);
      })
      .catch((err: Error) => {
        console.warn('Could not retrieve tags');
        console.warn(err);
      });
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={AppStyles.screenRootScrollView}>
          <View style={AppStyles.body}>
            <View style={AppStyles.sectionContainer}>
              <View style={AppStyles.listTagsButtonContainer}>
                <Button
                  onPress={() => {
                    getTags();
                  }}
                  title="List Pinboard tags"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <DumbTagList tags={tags} loading={loading} />
    </>
  );
};

export default DumbTagView;
