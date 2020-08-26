import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import RootPhoneModal from '../RootPhoneModal'
import MainTabs from './MainTabs'
import FileDrawer from '../FileDrawer'

const RootStack = createStackNavigator()

export default function RootPhoneNavigator (props) {
  return <RootStack.Navigator mode='modal'>
    <RootStack.Screen name='Main' component={RootDrawerNavigator} options={{ headerShown: false }}/>
    <RootStack.Screen name='RootPhoneModal' component={RootPhoneModal} />
  </RootStack.Navigator>
}

const RootDrawer = createDrawerNavigator()

function RootDrawerNavigator (props) {
  return <RootDrawer.Navigator initialRouteName='MainTabs'>
    <RootDrawer.Screen name='MainTabs' component={MainTabs} />
    <RootDrawer.Screen name='FileDrawer' component={FileDrawer} />
  </RootDrawer.Navigator>
}