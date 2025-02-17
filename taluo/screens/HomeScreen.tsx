// HomeScreen.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExploreTab from './ExploreTab';
import FortuneTab from './FortuneTab';
import ProfileTab from './ProfileTab';

const Tab = createBottomTabNavigator();

const HomeScreen: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // 隐藏顶部标题栏
      }}
    >
      <Tab.Screen name="探索" component={ExploreTab} />
      <Tab.Screen name="占卜" component={FortuneTab} />
      <Tab.Screen name="我的" component={ProfileTab} />
    </Tab.Navigator>
  );
};

export default HomeScreen;