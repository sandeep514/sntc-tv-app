import React from 'react';
import Basmati from './Basmati';
import Nonbasmati from './Nonbasmati';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();
export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Basmati">
        <Stack.Screen
          options={{headerShown: false}}
          name="Basmati"
          component={Basmati}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Nonbasmati"
          component={Nonbasmati}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
