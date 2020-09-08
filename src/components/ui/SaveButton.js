import React from 'react'
import { Button, Text } from 'native-base'
import t from 'format-message'

export default function SaveButton (props) {
  const noop = () => {}
  const savedText = props.changes ? t('Save') : t('Saved')
  return <Button success={!props.changes} warning={props.changes} transparent onPress={props.onPress ?? noop}>
    <Text>{savedText}</Text>
  </Button>
}
