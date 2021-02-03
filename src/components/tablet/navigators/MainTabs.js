import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ProjectHome from '../project/ProjectHome'
import OutlineHome from '../outline/OutlineHome'
import TimelineHome from '../timeline/TimelineHome'
import NotesHome from '../notes/NotesHome'
import CharactersHome from '../characters/CharactersHome'
import PlacesHome from '../places/PlacesHome'
import TagsHome from '../tags/TagsHome'
import { TabBarOptions, TabScreenOptions } from '../../shared/navigators'

const Tab = createBottomTabNavigator()

export default function MainTabs(props) {
  return (
    <Tab.Navigator
      tabBarOptions={TabBarOptions}
      screenOptions={TabScreenOptions}>
      <Tab.Screen
        name='Project'
        component={ProjectHome}
        initialParams={{ openDrawer: props.route?.params?.openDrawer }}
      />
      <Tab.Screen
        name='Timeline'
        component={TimelineHome}
        initialParams={{ openDrawer: props.route?.params?.openDrawer }}
      />
      <Tab.Screen
        name='Outline'
        component={OutlineHome}
        initialParams={{ openDrawer: props.route?.params?.openDrawer }}
      />
      <Tab.Screen
        name='Notes'
        component={NotesHome}
        initialParams={{ openDrawer: props.route?.params?.openDrawer }}
      />
      <Tab.Screen
        name='Characters'
        component={CharactersHome}
        initialParams={{ openDrawer: props.route?.params?.openDrawer }}
      />
      <Tab.Screen
        name='Places'
        component={PlacesHome}
        initialParams={{ openDrawer: props.route?.params?.openDrawer }}
      />
      <Tab.Screen
        name='Tags'
        component={TagsHome}
        initialParams={{ openDrawer: props.route?.params?.openDrawer }}
      />
    </Tab.Navigator>
  )
}
