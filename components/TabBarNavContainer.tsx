import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import About from 'components/About';
import DebugInfo from 'components/DebugInfo';
import {DiscoverStackScreen} from 'components/Discover';
import {ProfileStackScreen} from 'components/Profile';
import DumbTagView from 'components/DumbTagView';
import {FunctionalColors} from 'style/Colors';
import {PinboardContext} from 'hooks/usePinboard';
import {PinboardMode} from 'lib/Pinboard';
import {StyleSheet} from 'react-native';

const Styles = StyleSheet.create({
  mockBadgeStyle: {
    backgroundColor: 'purple',
  },
});

const TabBar = createBottomTabNavigator();

const TabBarNavContainer = () => {
  const {pinboard} = useContext(PinboardContext);

  const mockModeBadgeOpts =
    pinboard.mode === PinboardMode.Production
      ? {}
      : {
          tabBarBadge: 'mock',
          tabBarBadgeStyle: Styles.mockBadgeStyle,
        };

  return (
    <NavigationContainer>
      <TabBar.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            let iconName;

            if (route.name === 'Discover') {
              iconName = 'ios-compass';
            } else if (route.name === 'DumbTags') {
              iconName = 'ios-pricetags';
            } else if (route.name === 'About') {
              iconName = 'ios-information-circle';
            } else if (route.name === 'Profile') {
              iconName = 'ios-person';
            } else if (route.name === 'Debug') {
              iconName = 'ios-bug';
            } else {
              console.error(
                `Unknown route ${route.name}, showing question mark icon`,
              );
              iconName = 'ios-help';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: FunctionalColors.TabBarIconSelected,
          inactiveTintColor: FunctionalColors.TabBarIconDeselected,
        }}>
        <TabBar.Screen name="Discover" component={DiscoverStackScreen} />
        <TabBar.Screen name="DumbTags" component={DumbTagView} />
        <TabBar.Screen name="Profile" component={ProfileStackScreen} />
        <TabBar.Screen
          name="About"
          component={About}
          options={mockModeBadgeOpts}
        />
        <TabBar.Screen name="Debug" component={DebugInfo} />
      </TabBar.Navigator>
    </NavigationContainer>
  );
};

export default TabBarNavContainer;
