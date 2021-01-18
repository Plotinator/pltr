import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import OutlineStack from './OutlineStack'
import NotesStack from './NotesStack'
import CharactersStack from './CharactersStack'
import PlacesStack from './PlacesStack'
import TagsStack from './TagsStack'
import { chooseIcon, tabBarOptions } from '../../../utils/tab_icons'
import { Icon } from 'native-base'
import styles from './MainTabsStyle'

const Tab = createBottomTabNavigator()

export default function MainTabs (props) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: (props) => <TabIcon {...props} route={route} />,
        tabBarButton: TabButton
      })}
      tabBarOptions={{
        ...tabBarOptions,
        style: styles.tabContainer,
        labelStyle: styles.tabLabel
      }}>
      <Tab.Screen name='Outline' component={OutlineStack} initialParams={{ openDrawer: props.route?.params?.openDrawer }} />
      <Tab.Screen name='Notes' component={NotesStack} initialParams={{ openDrawer: props.route?.params?.openDrawer }} />
      <Tab.Screen name='Characters' component={CharactersStack} initialParams={{ openDrawer: props.route?.params?.openDrawer }} />
      <Tab.Screen name='Places' component={PlacesStack} initialParams={{ openDrawer: props.route?.params?.openDrawer }} />
      <Tab.Screen name='Tags' component={TagsStack} initialParams={{ openDrawer: props.route?.params?.openDrawer }} />
    </Tab.Navigator>
  )
}

const TabIcon = ({ focused, color, size, route }) => {
  const iconName = chooseIcon(route.name)
  return (
    <Icon
      type='FontAwesome5'
      active={focused}
      name={iconName}
      style={[{ fontSize: size, color: color }, styles.tabIcon]}
    />
  )
}

const TabButton = (props) => {
  return <TouchableOpacity {...props} style={[props.style, styles.tabButton]}></TouchableOpacity>
}
