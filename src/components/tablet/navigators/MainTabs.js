import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ProjectHome from '../project/ProjectHome'
import OutlineHome from '../outline/OutlineHome'
import TimelineHome from '../timeline/TimelineHome'
import NotesHome from '../notes/NotesHome'
import CharactersHome from '../characters/CharactersHome'
import PlacesHome from '../places/PlacesHome'
import TagsHome from '../tags/TagsHome'
import { chooseIcon, tabBarOptions } from '../../../utils/tab_icons'
import { Icon } from 'native-base'
import { isTablet } from 'react-native-device-info'

const Tab = createBottomTabNavigator()

export default function MainTabs (props) {
  return <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        const iconName = chooseIcon(route.name)
        let marginLeft = 0
        if (isTablet()) {
          marginLeft = ['Characters', 'Tags'].includes(route.name) ? -6 : 0
        }
        return <Icon type='FontAwesome5' active={focused} name={iconName} style={{fontSize: size, color, marginLeft}}/>
      },
    })}
    tabBarOptions={{...tabBarOptions, style:{paddingBottom: 6}, safeAreaInsets:{bottom: 10}}}
  >
    <Tab.Screen name='Project' component={ProjectHome} initialParams={{closeFile: props.route?.params?.closeFile}}/>
    <Tab.Screen name='Timeline' component={TimelineHome} />
    <Tab.Screen name='Outline' component={OutlineHome} />
    <Tab.Screen name='Notes' component={NotesHome} />
    <Tab.Screen name='Characters' component={CharactersHome} />
    <Tab.Screen name='Places' component={PlacesHome} />
    <Tab.Screen name='Tags' component={TagsHome} />
  </Tab.Navigator>
}
