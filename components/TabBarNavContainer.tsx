import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import SettingsScreen from 'components/SettingsScreen';
import DebugInfo from 'components/DebugInfo';
import {DiscoverStackScreen} from 'components/Discover';
import {ProfileStackScreen} from 'components/Profile';
import {TagManagerStackScreen} from 'components/TagScreen';
import {FunctionalColors} from 'style/Colors';
import {AppConfigurationContext} from 'hooks/useAppConfiguration';
import {StyleSheet} from 'react-native';

const Styles = StyleSheet.create({
  mockBadgeStyle: {
    backgroundColor: 'purple',
  },
});

const TabBar = createBottomTabNavigator();

const TabBarNavContainer = () => {
  const {productionMode} = useContext(AppConfigurationContext);

  const mockModeBadgeOpts = productionMode
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
          name="Settings"
          component={SettingsScreen}
          options={{
            ...mockModeBadgeOpts,
            tabBarIcon: ({color, size}) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
        <TabBar.Screen
          name="Discover"
          component={DiscoverStackScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Ionicons name="compass" size={size} color={color} />
            ),
          }}
        />
        <TabBar.Screen
          name="Tags"
          component={TagManagerStackScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Ionicons name="pricetags" size={size} color={color} />
            ),
          }}
        />
        <TabBar.Screen
          name="Profile"
          component={ProfileStackScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        <TabBar.Screen
          name="Debug"
          component={DebugInfo}
          options={{
            tabBarIcon: ({color, size}) => (
              <Ionicons name="bug" size={size} color={color} />
            ),
          }}
        />
      </TabBar.Navigator>
    </NavigationContainer>
  );
};

export default TabBarNavContainer;
