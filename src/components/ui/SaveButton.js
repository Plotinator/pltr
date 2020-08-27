import React from 'react'
import { Button, Text } from 'native-base'
import i18n from 'format-message'

export default function SaveButton (props) {
  const noop = () => {}
  const savedText = props.changes ? i18n('Save') : i18n('Saved')
  return <Button success={!props.changes} warning={props.changes} transparent onPress={props.onPress ?? noop}>
    <Text>{savedText}</Text>
  </Button>
}