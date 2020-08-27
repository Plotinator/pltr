import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import i18n from 'format-message'
import MainTabs from './MainTabs'
import FileDrawer from '../FileDrawer'
import AttachmentSelectorModal from '../attachments/AttachmentSelectorModal'
import { attachmentHeaderTitles } from '../../../utils/attachment_titles'

const RootStack = createStackNavigator()

export default function RootPhoneNavigator (props) {
  return <RootStack.Navigator mode='modal'>
    <RootStack.Screen name='Main' component={RootDrawerNavigator} options={{ headerShown: false }}/>
    <RootStack.Screen name='AttachmentSelectorModal' component={AttachmentSelectorModal}
      options={({route}) => ({
        title: attachmentHeaderTitles(route.params.type),
        headerBackTitle: i18n('Back'),
      })}
    />
  </RootStack.Navigator>
}

const RootDrawer = createDrawerNavigator()

function RootDrawerNavigator (props) {
  return <RootDrawer.Navigator initialRouteName='MainTabs'>
    <RootDrawer.Screen name='MainTabs' component={MainTabs} />
    <RootDrawer.Screen name='FileDrawer' component={FileDrawer} />
  </RootDrawer.Navigator>
}