import React from 'react'
import { StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import OutlineStack from './OutlineStack'
import NotesStack from './NotesStack'
import CharactersStack from './CharactersStack'
import PlacesStack from './PlacesStack'
import TagsStack from './TagsStack'
import { TabBarOptions, TabScreenOptions } from '../../shared/navigators'

const Tab = createBottomTabNavigator()

export default function MainTabs(props) {
  return (
    <Tab.Navigator
      tabBarOptions={TabBarOptions}
      screenOptions={TabScreenOptions}>
      <Tab.Screen
        name='Outline'
        component={OutlineStack}
        initialParams={{ openDrawer: props.route?.params?.openDrawer }}
      />
      <Tab.Screen
        name='Notes'
        component={NotesStack}
        initialParams={{ openDrawer: props.route?.params?.openDrawer }}
      />
      <Tab.Screen
        name='Characters'
        component={CharactersStack}
        initialParams={{ openDrawer: props.route?.params?.openDrawer }}
      />
      <Tab.Screen
        name='Places'
        component={PlacesStack}
        initialParams={{ openDrawer: props.route?.params?.openDrawer }}
      />
      <Tab.Screen
        name='Tags'
        component={TagsStack}
        initialParams={{ openDrawer: props.route?.params?.openDrawer }}
      />
    </Tab.Navigator>
  )
}
