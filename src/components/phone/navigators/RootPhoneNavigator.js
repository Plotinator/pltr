import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import i18n from 'format-message'
import RootPhoneModal from '../RootPhoneModal'
import MainTabs from './MainTabs'
import FileDrawer from '../FileDrawer'
import AttachmentSelectorModal from '../AttachmentSelectorModal'

const RootStack = createStackNavigator()

export default function RootPhoneNavigator (props) {
  const attachmentTitles = (type) => {
    switch (type) {
      case 'characters':
        return i18n('Attach Characters')
      case 'places':
        return i18n('Attach Places')
      case 'tags':
        return i18n('Attach Tags')
    }
  }

  return <RootStack.Navigator mode='modal'>
    <RootStack.Screen name='Main' component={RootDrawerNavigator} options={{ headerShown: false }}/>
    <RootStack.Screen name='AttachmentSelectorModal' component={AttachmentSelectorModal} options={({route}) => ({ title: attachmentTitles(route.params.type) })} />
  </RootStack.Navigator>
}

const RootDrawer = createDrawerNavigator()

function RootDrawerNavigator (props) {
  return <RootDrawer.Navigator initialRouteName='MainTabs'>
    <RootDrawer.Screen name='MainTabs' component={MainTabs} />
    <RootDrawer.Screen name='FileDrawer' component={FileDrawer} />
  </RootDrawer.Navigator>
}