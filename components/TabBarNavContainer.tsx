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
        tabBarOptions={{
          activeTintColor: FunctionalColors.TabBarIconSelected,
          inactiveTintColor: FunctionalColors.TabBarIconDeselected,
        }}>
        <TabBar.Screen
          name="Discover"
          component={DiscoverStackScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Ionicons name="ios-compass" size={size} color={color} />
            ),
          }}
        />
        <TabBar.Screen
          name="DumbTags"
          component={DumbTagView}
          options={{
            tabBarIcon: ({color, size}) => (
              <Ionicons name="ios-pricetags" size={size} color={color} />
            ),
          }}
        />
        <TabBar.Screen
          name="Profile"
          component={ProfileStackScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Ionicons name="ios-person" size={size} color={color} />
            ),
          }}
        />
        <TabBar.Screen
          name="About"
          component={About}
          options={{
            ...mockModeBadgeOpts,
            tabBarIcon: ({color, size}) => (
              <Ionicons name="ios-person" size={size} color={color} />
            ),
          }}
        />
        <TabBar.Screen
          name="Debug"
          component={DebugInfo}
          options={{
            tabBarIcon: ({color, size}) => (
              <Ionicons name="ios-bug" size={size} color={color} />
            ),
          }}
        />
      </TabBar.Navigator>
    </NavigationContainer>
  );
};

export default TabBarNavContainer;
