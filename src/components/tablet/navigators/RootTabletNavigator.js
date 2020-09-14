import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import SceneCardModal from '../SceneCardModal'
import MainTabs from './MainTabs'

const RootStack = createStackNavigator()

export default function RootTabletNavigator (props) {
  return <RootStack.Navigator mode='modal'>
    <RootStack.Screen name='Main' component={MainTabs} options={{ headerShown: false }}/>
    <RootStack.Screen name='SceneCardModal' component={SceneCardModal} />
  </RootStack.Navigator>
}
