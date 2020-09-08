import React from 'react'
import { Button, Icon } from 'native-base'

export default function AddButton (props) {
  const noop = () => {}
  return <Button transparent onPress={props.onPress ?? noop} style={props.buttonStyle ?? {}}>
    <Icon type='FontAwesome5' name='plus' style={[{color: '#ff7f32'}, props.iconStyle]}/>
  </Button>
}
