import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import About from 'components/About';
import {DiscoverStackScreen} from 'components/Discover';
import DumbTagView from 'components/DumbTagView';
import {FunctionalColors} from 'style/Colors';

const TabBar = createBottomTabNavigator();

const TabBarNavContainer = () => {
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
            } else {
              console.error(`Unknown route ${route.name}, showing bug icon`);
              iconName = 'ios-bug';
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
        <TabBar.Screen name="About" component={About} />
      </TabBar.Navigator>
    </NavigationContainer>
  );
};

export default TabBarNavContainer;
