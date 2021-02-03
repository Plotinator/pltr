import React, { useRef, useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Drawer } from 'native-base'
import t from 'format-message'
import MainTabs from './MainTabs'
import CustomAttributesScreen from '../customAttributes/CustomAttributesScreen'
import { attachmentHeaderTitles } from '../../../utils/attachment_titles'
import SideBar from '../../shared/SideBar'
import PlotlinesStack from './PlotlinesStack'
import AttachmentSelectorModal from '../shared/AttachmentSelectorModal'
import ColorPickerScreen from '../shared/ColorPickerScreen'
import ErrorBoundary from '../../shared/ErrorBoundary'

const RootStack = createStackNavigator()

export default function RootPhoneNavigator(props) {
  const drawerRef = useRef(null)
  const closeDrawer = () => drawerRef.current._root.close()
  const openDrawer = () => drawerRef.current._root.open()

  return (
    <ErrorBoundary>
      <Drawer
        ref={drawerRef}
        content={
          <SideBar
            closeFile={props.closeFile}
            closeDrawer={closeDrawer}
            logout={props.logout}
          />
        }
        onClose={closeDrawer}>
        <RootStack.Navigator mode='modal'>
          <RootStack.Screen
            name='Main'
            component={MainTabs}
            options={{ headerShown: false }}
            initialParams={{ openDrawer }}
          />
          <RootStack.Screen
            name='CustomAttributesModal'
            component={CustomAttributesScreen}
            options={{
              title: t('Custom Attributes'),
              headerBackTitle: t('Done')
            }}
          />
          <RootStack.Screen
            name='AttachmentSelectorModal'
            component={AttachmentSelectorModal}
            options={({ route }) => ({
              title: attachmentHeaderTitles(route.params.type),
              headerBackTitle: t('Done')
            })}
          />
          <RootStack.Screen
            name='PlotlinesModal'
            component={PlotlinesStack}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name='ColorPickerModal'
            component={ColorPickerScreen}
            options={{ title: t('Color Picker'), headerBackTitle: t('Back') }}
          />
        </RootStack.Navigator>
      </Drawer>
    </ErrorBoundary>
  )
}