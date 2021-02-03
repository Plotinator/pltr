import React from 'react'
import { TouchableOpacity } from 'react-native'
import styles from './TabStyles'

export default (props) => {
  return <TouchableOpacity {...props} style={[props.style, styles.tabButton]} />
}
