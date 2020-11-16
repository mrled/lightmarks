import React, {useContext, useState} from 'react';
import {Button, SafeAreaView, ScrollView, View} from 'react-native';

import DumbTagList from 'components/DumbTagList';
import {PinboardContext} from 'hooks/usePinboard';
import {Pinboard} from 'lib/Pinboard';
import Styles from 'lib/Styles';

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
        console.error('Could not retrieve tags');
        console.error(err);
      });
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={Styles.scrollView}>
          <View style={Styles.body}>
            <View style={Styles.sectionContainer}>
              <View style={Styles.listTagsButtonContainer}>
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
