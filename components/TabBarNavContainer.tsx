import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import About from 'components/About';
import DiscoverView from 'components/DiscoverView';
import DumbTagView from 'components/DumbTagView';

const TabBar = createBottomTabNavigator();

const TabBarNavContainer = () => {
  return (
    <NavigationContainer>
      <TabBar.Navigator>
        <TabBar.Screen name="Discover" component={DiscoverView} />
        <TabBar.Screen name="DumbTags" component={DumbTagView} />
        <TabBar.Screen name="About" component={About} />
      </TabBar.Navigator>
    </NavigationContainer>
  );
};

export default TabBarNavContainer;
