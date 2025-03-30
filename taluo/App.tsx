import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import IAPManager from './utils/IAPManager';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined; 
  FortuneTab: { buttonId: string } | undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  // 初始化 IAP
  useEffect(() => {
    IAPManager.initialize();
    return () => {
      IAPManager.cleanup();
    };
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
            initialRouteName="Signup">
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}
