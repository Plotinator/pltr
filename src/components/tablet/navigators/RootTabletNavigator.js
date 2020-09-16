import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import MainTabs from './MainTabs'
import AttachmentSelectorModal from '../../shared/attachments/AttachmentSelectorModal'

const RootStack = createStackNavigator()

export default function RootTabletNavigator (props) {
  return <RootStack.Navigator mode='modal'>
    <RootStack.Screen name='Main' component={MainTabs} options={{ headerShown: false }}/>
    <RootStack.Screen name='AttachmentSelectorModal' component={AttachmentSelectorModal} />
  </RootStack.Navigator>
}
