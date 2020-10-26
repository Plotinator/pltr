import React from 'react'
import { Button, Text } from 'native-base'
import t from 'format-message'
import { StyleSheet } from 'react-native'

export default function SaveButton (props) {
  const noop = () => {}
  const savedText = props.changes ? t('Save') : t('Saved')
  return <Button success={!props.changes} warning={props.changes}
      transparent={!props.changes} small={props.changes}
      onPress={props.onPress ?? noop}
      style={props.changes ? styles.changes : styles.noChanges}
    >
    <Text style={props.changes ? styles.textChanges : styles.textNoChanges}>{savedText}</Text>
  </Button>
}

const styles = StyleSheet.create({
  changes: {
    marginRight: 16,
    borderColor: '#ff7f32', //orange
    backgroundColor: '#ff7f32', //orange
  },
  noChanges: {

  },
  textChanges: {
    color: 'white',
    fontWeight: 'bold',
  },
  textNoChanges: {
    fontSize: 20,
  },
})
