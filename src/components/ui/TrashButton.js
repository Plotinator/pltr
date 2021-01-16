import React from 'react'
import { Button, Icon } from 'native-base'

export default function TrashButton (props) {
  const handlePress = () => {
    const { onPress, data } = props
    if(onPress) onPress(data)
  }
  return <Button full danger onPress={handlePress} style={[{ flex: 1, width: 75 }, props.buttonStyle ?? {}]}>
    <Icon type='FontAwesome5' name='trash' style={props.iconStyle}/>
  </Button>
}
