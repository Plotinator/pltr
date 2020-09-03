import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import OutlineStack from './OutlineStack'
import NotesStack from './NotesStack'
import CharactersStack from './CharactersStack'
import PlacesStack from './PlacesStack'
import TagsStack from './TagsStack'
import { chooseIcon, tabBarOptions } from '../../../utils/tab_icons'
import { Icon } from 'native-base'

const Tab = createBottomTabNavigator()

export default function MainTabs (props) {
  return <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        const iconName = chooseIcon(route.name)
        return <Icon type='FontAwesome5' active={focused} name={iconName} style={{fontSize: size, color: color}}/>
      },
    })}
    tabBarOptions={tabBarOptions}
  >
    <Tab.Screen name='Outline' component={OutlineStack} />
    <Tab.Screen name='Notes' component={NotesStack} />
    <Tab.Screen name='Characters' component={CharactersStack} />
    <Tab.Screen name='Places' component={PlacesStack} />
    <Tab.Screen name='Tags' component={TagsStack} />
  </Tab.Navigator>
}
