import {StyleSheet} from 'react-native';

import {FunctionalColors, NamedColors} from 'style/Colors';

/* Application-wide, general styles
 */
export const AppStyles = StyleSheet.create({
  scrollView: {
    backgroundColor: NamedColors.OffWhite,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: 'white',
  },
  listTagsButtonContainer: {
    marginTop: 32,
    borderWidth: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: NamedColors.DarkGray,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: NamedColors.DarkGray,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
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
  listItemView: {
    backgroundColor: 'white',
    // borderBottomWidth: 1,
    // borderBottomColor: FunctionalColors.ListItemBorder,
    padding: 18,
  },
  listItemText: {
    fontSize: 18,
  },
  listItemTitle: {
    fontSize: 21,
    fontWeight: 'bold',
  },
});
