import React, { useRef, useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Drawer } from 'native-base'
import t from 'format-message'
import MainTabs from './MainTabs'
import AttachmentSelectorModal from '../../ui/attachments/AttachmentSelectorModal'
import CustomAttributesModal from '../customAttributes/CustomAttributesModal'
import { attachmentHeaderTitles } from '../../../utils/attachment_titles'
import SideBar from '../project/SideBar'
import PlotlinesStack from './PlotlinesStack'

const RootStack = createStackNavigator()

export default function RootPhoneNavigator (props) {
  const drawerRef = useRef(null)
  const closeDrawer = () => drawerRef.current._root.close()
  const openDrawer = () => drawerRef.current._root.open()

  return <Drawer ref={drawerRef} content={<SideBar closeFile={props.closeFile}/>} onClose={closeDrawer}>
    <RootStack.Navigator mode='modal'>
      <RootStack.Screen name='Main' component={MainTabs} options={{ headerShown: false }} initialParams={{openDrawer}}/>
      <RootStack.Screen name='CustomAttributesModal' component={CustomAttributesModal}
        options={{ title: t('Custom Attributes'), headerBackTitle: t('Done') }}
      />
      <RootStack.Screen name='AttachmentSelectorModal' component={AttachmentSelectorModal}
        options={({route}) => ({ title: attachmentHeaderTitles(route.params.type), headerBackTitle: t('Done') })}
      />
      <RootStack.Screen name='PlotlinesModal' component={PlotlinesStack} options={{ headerShown: false }} />
    </RootStack.Navigator>
  </Drawer>
}
