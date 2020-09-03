import React from 'react'
import { Button, Icon } from 'native-base'

export default function DrawerButton (props) {
  const openDrawer = () => {
    props.navigation.openDrawer()
  }

  return <Button transparent light onPress={openDrawer} style={props.buttonStyle ?? {}}>
    <Icon type='FontAwesome5' name='bars' style={props.iconStyle}/>
  </Button>
}