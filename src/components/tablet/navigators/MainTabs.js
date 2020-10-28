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
    <Tab.Screen name='Project' component={ProjectHome} initialParams={{openDrawer: props.route?.params?.openDrawer}} />
    <Tab.Screen name='Timeline' component={TimelineHome} initialParams={{openDrawer: props.route?.params?.openDrawer}} />
    <Tab.Screen name='Outline' component={OutlineHome} initialParams={{openDrawer: props.route?.params?.openDrawer}} />
    <Tab.Screen name='Notes' component={NotesHome} initialParams={{openDrawer: props.route?.params?.openDrawer}} />
    <Tab.Screen name='Characters' component={CharactersHome} initialParams={{openDrawer: props.route?.params?.openDrawer}} />
    <Tab.Screen name='Places' component={PlacesHome} initialParams={{openDrawer: props.route?.params?.openDrawer}} />
    <Tab.Screen name='Tags' component={TagsHome} initialParams={{openDrawer: props.route?.params?.openDrawer}} />
  </Tab.Navigator>
}
