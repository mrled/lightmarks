import {useNavigation} from '@react-navigation/native';
import usePbApiPostsAdd from 'hooks/pinboard/usePbApiPostsAdd';
import React, {useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

/* Warning: this module is imported from the Share entrypoint,
 * and react-native-gesture-handler does NOT play well with it.
 *
 * If you use RNGH's Switch and TextInput classes, this component will work fine from within the app,
 * but if you open the share sheet (which mounts this component) you will get errors like
 *
 * [Mon Nov 23 2020 00:03:37.568]  ERROR    TypeError: null is not an object (evaluating '_RNGestureHandlerModule.default.Direction')
 * [Mon Nov 23 2020 00:03:37.568]  ERROR    Invariant Violation: Module AppRegistry is not a registered callable module (calling runApplication)
 * [Mon Nov 23 2020 00:03:38.585]  ERROR    Invariant Violation: Module AppRegistry is not a registered callable module (calling runApplication)
 *
 */
// import {Switch, TextInput} from 'react-native-gesture-handler';

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

type AddBookmarkScreenParams = {
  dismiss: () => void;
  initialUri?: string;
  initialTitle?: string;
  initialDesc?: string;
};

export const AddBookmarkScreen: React.FC<AddBookmarkScreenParams> = ({
  dismiss,
  initialUri,
  initialTitle,
  initialDesc,
}) => {
  const [uri, setUri] = useState(initialUri ? initialUri : '');
  const [title, setTitle] = useState(initialTitle ? initialTitle : '');
  const [desc, setDesc] = useState(initialDesc ? initialDesc : '');
  const [tags, setTags] = useState<string[]>([]);
  const [readLater, setReadLater] = useState(false);
  const [priv, setPriv] = useState(false);

  const [mutate, data] = usePbApiPostsAdd({
    url: uri,
    description: title,
    extended: desc,
    tags: tags,
    replace: 'no',
    shared: priv ? 'no' : 'yes',
    toread: readLater ? 'yes' : 'no',
  });

  console.log(
    `AddBookmarkScreen: Got params: uri ${uri}, title ${title}, desc ${desc}`,
  );

  const cancel = () => {
    dismiss();
  };
  const submit = () => {
    console.log(`AddBookmarkScreen: Submitting ${uri}!`);
    mutate();
    console.log(`AddBookmarkScreen: mutation data result: ${data}`);
    dismiss();
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
                onChangeText={(newText: string) => setUri(newText)}
                value={uri}
              />
              <Text style={AppStyles.textInputLabel}>Title</Text>
              <TextInput
                style={AppStyles.textInputBox}
                multiline={true}
                textAlignVertical="top"
                onChangeText={(newText: string) => setTitle(newText)}
                value={title}
              />
              <Text style={AppStyles.textInputLabel}>Description</Text>
              <TextInput
                style={AppStyles.textInputBox}
                multiline={true}
                textAlignVertical="top"
                onChangeText={(newText: string) => setDesc(newText)}
                value={desc}
              />
              <Text style={AppStyles.textInputLabel}>Tags</Text>
              <TextInput
                style={AppStyles.textInputBox}
                autoCapitalize="none"
                multiline={true}
                textAlignVertical="top"
                onChangeText={(newText: string) => setTags(newText.split(' '))}
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

type AddBookmarkScreenWithBackParams = {
  initialUri?: string;
  initialTitle?: string;
  initialDesc?: string;
};

export const AddBookmarkScreenWithBack: React.FC<AddBookmarkScreenWithBackParams> = ({
  initialUri,
  initialTitle,
  initialDesc,
}) => {
  const navigation = useNavigation();
  const dismiss = () => navigation.goBack();
  return (
    <AddBookmarkScreen
      dismiss={dismiss}
      initialUri={initialUri}
      initialTitle={initialTitle}
      initialDesc={initialDesc}
    />
  );
};
