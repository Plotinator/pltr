import React from 'react'
import TabButton from './TabButton'
import TabIcon from './TabIcon'
import TabStyles from './TabStyles'

const TabBarOptions = {
  activeTintColor: '#ff7f32',
  keyboardHidesTabBar: true,
  style: TabStyles.tabContainer,
  labelStyle: TabStyles.tabLabel,
  safeAreaInsets: { bottom: 10 }
}

const TabScreenOptions = ({ route }) => ({
  tabBarIcon: (props) => <TabIcon {...props} route={route} />,
  tabBarButton: TabButton
})

export { TabIcon, TabButton, TabStyles, TabBarOptions, TabScreenOptions }
