import React, { useRef } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import MainTabs from './MainTabs'
import SideBar from '../../shared/SideBar'
import { Drawer } from 'native-base'

const RootStack = createStackNavigator()

export default function RootTabletNavigator(props) {
  const drawerRef = useRef(null)
  const closeDrawer = () => drawerRef.current._root.close()
  const openDrawer = () => drawerRef.current._root.open()

  return (
    <Drawer
      ref={drawerRef}
      content={
        <SideBar
          closeFile={props.closeFile}
          closeDrawer={closeDrawer}
          logout={props.logout}
        />
      }
      onClose={closeDrawer}
      openDrawerOffset={0.7}>
      <RootStack.Navigator mode='modal'>
        <RootStack.Screen
          name='Main'
          component={MainTabs}
          options={{ headerShown: false }}
          initialParams={{ openDrawer }}
        />
      </RootStack.Navigator>
    </Drawer>
  )
}
