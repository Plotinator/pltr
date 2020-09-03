import React from 'react'
import { Button, Text } from 'native-base'
import i18n from 'format-message'

export default function EditButton (props) {
  const noop = () => {}
  return <Button full onPress={props.onPress ?? noop} style={[{ flex: 1, width: 75 }, props.buttonStyle ?? {}]}>
    <Text>{i18n('Edit')}</Text>
  </Button>
}