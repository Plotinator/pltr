import React from 'react'
import { StyleSheet } from 'react-native'
import { Button, Text, Icon } from 'native-base'
import t from 'format-message'

export default function NewButton (props) {
  const defaultPress = () => {}
  return <Button bordered iconLeft style={styles.button} onPress={props.onPress ?? defaultPress}>
    <Icon type='FontAwesome5' name='plus' style={styles.icon}/>
    <Text style={styles.text}>{t('New')}</Text>
  </Button>
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    alignSelf: 'center',
    borderColor: 'hsl(211, 27%, 70%)', //gray-6
  },
  text: {
    color: 'hsl(209, 61%, 16%)', //gray-0
  },
  icon: {
    color: 'hsl(209, 61%, 16%)', //gray-0
  },
})