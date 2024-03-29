import {StyleSheet} from 'react-native';

import {FunctionalColors, NamedColors} from 'style/Colors';

const styleBases = {
  buttonView: {
    borderWidth: 1,
    borderRadius: 4,
  },
  textInputBox_L: {
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    // borderWidth: 1,
    borderColor: NamedColors.DarkGray,
    padding: 4,
  },
  textInputBox: {
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 4,
    borderRadius: 4,
  },
};

/* Application-wide, general styles
 */
export const AppStyles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
    paddingBottom: 24,
  },
  flex: {
    flex: 1,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  headerRightIconButton: {
    marginRight: 12,
    color: 'tomato',
  },
  linkColor: {
    color: 'blue',
  },
  listTagsButtonContainer: {
    marginTop: 32,
    borderWidth: 1,
  },
  loginButtonView: {
    ...styleBases.buttonView,
    borderWidth: 2,
    borderColor: 'tomato',
  },
  loginSubsection: {
    paddingTop: 12,
  },
  screenRootScrollView: {
    backgroundColor: NamedColors.OffWhite,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
    paddingVertical: 24,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: NamedColors.DarkGray,
  },
  subSectionContainer: {
    marginVertical: 8,
  },
  textInputBox: {
    ...styleBases.textInputBox,
    fontSize: 24,
  },
  textInputBoxUrl: {
    ...styleBases.textInputBox,
  },
  textInputLabel: {
    color: NamedColors.DarkGray,
    margin: 4,
  },
  textInputLabelSmall: {
    color: NamedColors.DarkGray,
    margin: 4,
    fontSize: 12,
  },
});

/* Styles related to displaying bookmark metadata
 */
export const BookmarkStyles = StyleSheet.create({
  listItemAuthorDate: {
    paddingVertical: 4,
    color: 'gray',
  },
  listItemExtendedDescText: {
    marginLeft: 6,
  },
  listItemExtendedDescView: {
    // backgroundColor: FunctionalColors.BlockquoteBackground,
    marginVertical: 12,
    marginLeft: 4,
    borderLeftWidth: 2,
    borderLeftColor: FunctionalColors.BlockquoteBorderLeft,
    borderRightColor: 'black',
  },
  listItemLink: {
    paddingVertical: 4,
    color: FunctionalColors.Link,
  },
  listItemPrivateView: {
    backgroundColor: 'lightgray',
    padding: 18,
  },
  listItemPublicView: {
    backgroundColor: 'white',
    padding: 18,
  },
  listItemText: {
    fontSize: 18,
  },
  listItemTitle: {
    fontSize: 21,
    fontWeight: 'bold',
  },
  unreadBadgeText: {
    color: 'white',
    alignSelf: 'flex-start',
    backgroundColor: 'darkorchid',
    padding: 4,
  },
});

export const TagListStyles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  tagName: {
    fontSize: 21,
    fontWeight: 'bold',
  },
  bookmarkCount: {
    fontSize: 14,
    color: 'gray',
  },
});
