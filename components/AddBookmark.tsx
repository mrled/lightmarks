import {useNavigation} from '@react-navigation/native';
import {PinboardContext} from 'hooks/usePinboard';
import React, {useContext, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Switch, TextInput} from 'react-native-gesture-handler';
import {AppStyles} from 'style/Styles';

const Styles = StyleSheet.create({
  cancelSubmitButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelSubmitButtons: {
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 18,
  },
});

export type AddBookmarksParams = {
  initialUri?: string;
  initialTitle?: string;
  initialDesc?: string;
};
export const AddBookmarkScreen: React.FC<AddBookmarksParams> = ({
  initialUri,
  initialTitle,
  initialDesc,
}) => {
  const navigation = useNavigation();
  const [uri, setUri] = useState(initialUri ? initialUri : '');
  const [title, setTitle] = useState(initialTitle ? initialTitle : '');
  const [desc, setDesc] = useState(initialDesc ? initialDesc : '');
  const [tags, setTags] = useState<string[]>([]);
  const [readLater, setReadLater] = useState(false);
  const [priv, setPriv] = useState(false);
  const {pinboard} = useContext(PinboardContext);

  const cancel = () => {
    navigation.goBack();
  };
  const submit = () => {
    pinboard.api.posts.add({
      url: uri,
      description: title,
      extended: desc,
      tags: tags,
      replace: 'no',
      shared: priv ? 'no' : 'yes',
      toread: readLater ? 'yes' : 'no',
    });
    navigation.goBack();
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={AppStyles.screenRootScrollView}>
          <View style={AppStyles.body}>
            <View style={Styles.cancelSubmitButtonsContainer}>
              <View style={Styles.cancelSubmitButtons}>
                <Button title="Cancel" onPress={cancel} color="goldenrod" />
              </View>
              <View style={Styles.cancelSubmitButtons}>
                <Button title="Submit" onPress={submit} color="tomato" />
              </View>
            </View>
            {/* <View style={AppStyles.sectionContainer}>
              <Text style={AppStyles.sectionTitle}>Add Bookmark</Text>
            </View> */}
            <View style={AppStyles.sectionContainer}>
              <Text style={AppStyles.textInputLabel}>URL</Text>
              <TextInput
                style={AppStyles.textInputBoxUrl}
                autoCapitalize="none"
                multiline={true}
                textAlignVertical="top"
                onChangeText={(newText) => setUri(newText)}
                value={uri}
              />
              <Text style={AppStyles.textInputLabel}>Title</Text>
              <TextInput
                style={AppStyles.textInputBox}
                multiline={true}
                textAlignVertical="top"
                onChangeText={(newText) => setTitle(newText)}
                value={title}
              />
              <Text style={AppStyles.textInputLabel}>Description</Text>
              <TextInput
                style={AppStyles.textInputBox}
                multiline={true}
                textAlignVertical="top"
                onChangeText={(newText) => setDesc(newText)}
                value={desc}
              />
              <Text style={AppStyles.textInputLabel}>Tags</Text>
              <TextInput
                style={AppStyles.textInputBox}
                autoCapitalize="none"
                multiline={true}
                textAlignVertical="top"
                onChangeText={(newText) => setTags(newText.split(' '))}
                value={tags.join(' ')}
              />
              <Text style={AppStyles.textInputLabel}>Read Later</Text>
              <Switch
                value={readLater}
                onValueChange={() =>
                  setReadLater((prevState: boolean) => !prevState)
                }
              />
              <Text style={AppStyles.textInputLabel}>Private</Text>
              <Switch
                value={priv}
                onValueChange={() =>
                  setPriv((prevState: boolean) => !prevState)
                }
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
