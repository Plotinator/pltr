import React from 'react'
import { Button, Icon } from 'native-base'
import { isTablet } from 'react-native-device-info'
import { StyleSheet } from 'react-native'

const onTablet = isTablet()

export default function DrawerButton (props) {
  return <Button transparent={!onTablet} bordered={onTablet} light onPress={props.openDrawer} style={[onTablet ? styles.tabletButton : {}, props.buttonStyle]}>
    <Icon type='FontAwesome5' name='bars' style={[onTablet ? styles.tabletIcon : {}, props.iconStyle]}/>
  </Button>
}

const styles = StyleSheet.create({
  tabletButton: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: 'hsl(211, 27%, 70%)', //gray-6
    marginRight: 16,
  },
  tabletIcon: {
    color: 'hsl(210, 22%, 49%)', //gray-4
  },
})
