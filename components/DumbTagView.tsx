import React, {useState} from 'react';
import {Button, SafeAreaView, ScrollView, View} from 'react-native';

import DumbTagList from 'components/DumbTagList';
import usePinboard from 'hooks/usePinboard';
import Styles from 'lib/Styles';

interface DumbTagViewProps {
  pinboard: any; // TODO: fixme
}

const DumbTagView: React.FC<DumbTagViewProps> = () => {
  const [pinboard, , ,] = usePinboard();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<Array<string>>([]);

  const getTags = () => {
    setLoading(true);
    pinboard
      .getTags({})
      .then((value: Object) => {
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
