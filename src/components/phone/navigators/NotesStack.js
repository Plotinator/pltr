import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import NotesHome from '../notes/NotesHome'

const Stack = createStackNavigator()

export default function NotesStack (props) {
  return <Stack.Navigator>
    <Stack.Screen name='NotesHome' component={NotesHome}/>
  </Stack.Navigator>
}