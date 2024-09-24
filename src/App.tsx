/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import LoginView from './views/LoginView';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainTabView from './views/MainTabView';

const Stack = createNativeStackNavigator();
class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainView">
          <Stack.Screen name="LoginView" component={LoginView} />
          <Stack.Screen name="MainView" component={MainTabView} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
