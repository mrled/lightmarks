/* A list of items with text that navigate to another screen
 */

import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {FunctionalColors} from 'style/Colors';

const Styles = StyleSheet.create({
  itemIcon: {
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 18,
  },
  navListOuterView: {
    paddingBottom: 24,
  },
  sectionDescriptionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    color: 'gray',
  },
  sectionDescriptionView: {
    borderBottomWidth: 1,
    paddingBottom: 15,
  },
});

const DynamicStyles = {
  pressed: ({pressed}: {pressed: boolean}) => {
    return {
      backgroundColor: pressed ? 'lightgray' : 'white',
      paddingVertical: 15,
      borderBottomWidth: 1,
      flexDirection: 'row',
    };
  },
};

export class NavigationListDestination {
  constructor(
    // Title to appear to the user
    public title: string,
    // Name of an Ionicon
    public ionicon: string,
    // Function that navigates to the destination
    // Probably a function literal like '()=>navigation.navigate('ScreenName')
    public go: () => void,
    // Override the icon color
    public iconColorOverride?: string,
    // Override the <Pressable> style
    public pressableStyleOverride?: object,
  ) {}

  public toString() {
    return `${this.title}${this.ionicon}${this.go.toString}${this.iconColorOverride}${this.pressableStyleOverride}`;
  }
}

/* A single item in a navigation list
 * Shows an icon and title to a user, and navigates to a destination
 */
const NavigationListDestinationPressable: React.FC<{
  dest: NavigationListDestination;
}> = ({dest}) => {
  const iconColor = dest.iconColorOverride
    ? dest.iconColorOverride
    : FunctionalColors.NavigationListItemIcon;
  const pressableStyle = dest.pressableStyleOverride
    ? dest.pressableStyleOverride
    : DynamicStyles.pressed;
  return (
    <Pressable style={pressableStyle} onPress={dest.go}>
      <Ionicons
        style={Styles.itemIcon}
        name={dest.ionicon}
        color={iconColor}
        size={18}
      />
      <Text style={Styles.itemTitle}>{dest.title}</Text>
    </Pressable>
  );
};

/* A list of navigation items, including a title
 */
export const NavigationList: React.FC<{
  title: string;
  destinations: NavigationListDestination[];
}> = ({title, destinations}) => {
  return (
    <>
      <View style={Styles.navListOuterView}>
        <View style={Styles.sectionDescriptionView}>
          <Text style={Styles.sectionDescriptionText}>{title}</Text>
        </View>
        {destinations.map((dest) => (
          <NavigationListDestinationPressable
            dest={dest}
            key={dest.toString()}
          />
        ))}
      </View>
    </>
  );
};
