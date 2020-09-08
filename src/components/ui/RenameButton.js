import React from 'react'
import { Button, Text } from 'native-base'
import t from 'format-message'

export default function RenameButton (props) {
  const noop = () => {}
  return <Button full onPress={props.onPress ?? noop} style={[{ flex: 1, width: 85 }, props.buttonStyle ?? {}]}>
    <Text>{t('Rename')}</Text>
  </Button>
}
