import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, useColorScheme, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import ComponentShowcase from './screens/ComponentShowcase';
import ProfilePage from './screens/ProfilePage';

export type RootStackParamList = {
  Home: undefined;
  ComponentShowcase: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="ComponentShowcase"
            component={ComponentShowcase}
            options={({ navigation }) => ({
              title: 'Component Showcase',
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                  <Text style={{ fontSize: 16, color: '#4a90e2', fontWeight: '600' }}>
                    Profile
                  </Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="Profile"
            component={ProfilePage}
            options={{ title: 'My Profile' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
