import React, {useContext, useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';

import {PinboardContext} from 'hooks/usePinboard';
import {Pinboard} from 'lib/Pinboard';
import Styles from 'lib/Styles';

interface DiscoverViewProps {
  pinboard: Pinboard;
}
const DiscoverView: React.FC<DiscoverViewProps> = () => {
  const {pinboard} = useContext(PinboardContext);

  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={Styles.scrollView}>
          <View style={Styles.body}>
            <View style={Styles.sectionContainer}>
              <Text style={Styles.sectionTitle}>Discover</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default DiscoverView;
