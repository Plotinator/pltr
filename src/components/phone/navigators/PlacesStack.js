import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import PlacesHome from '../places/PlacesHome'

const Stack = createStackNavigator()

export default function PlacesStack (props) {
  return <Stack.Navigator>
    <Stack.Screen name='PlacesHome' component={PlacesHome}/>
  </Stack.Navigator>
}