import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import MainTabs from './MainTabs'

const RootStack = createStackNavigator()

export default function RootTabletNavigator (props) {
  return <RootStack.Navigator mode='modal'>
    <RootStack.Screen name='Main' component={MainTabs} options={{ headerShown: false }} initialParams={{closeFile: props.closeFile}}/>
  </RootStack.Navigator>
}
