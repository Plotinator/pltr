import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import CharactersHome from '../characters/CharactersHome'
import AddButton from '../../ui/AddButton'

const Stack = createStackNavigator()

export default function CharactersStack (props) {
  return <Stack.Navigator>
    <Stack.Screen name='CharactersHome' component={CharactersHome}/>
  </Stack.Navigator>
}