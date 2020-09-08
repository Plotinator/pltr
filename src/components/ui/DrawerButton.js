import React from 'react'
import { Button, Icon } from 'native-base'

export default function DrawerButton (props) {
  return <Button transparent light onPress={props.openDrawer} style={props.buttonStyle ?? {}}>
    <Icon type='FontAwesome5' name='bars' style={props.iconStyle}/>
  </Button>
}
