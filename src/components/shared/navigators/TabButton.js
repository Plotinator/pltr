import React, { useState } from 'react'
import { View, TouchableOpacity, Dimensions } from 'react-native'
import styles from './TabStyles'

const isHorizontal = () => {
  const { width, height } = Dimensions.get('window')
  return width > height
}

export default props => {
  const [isTight, setTight] = useState(isHorizontal())
  const onLayout = () => setTight(isHorizontal())

  return (
    <View onLayout={onLayout} style={styles.buttonFlex}>
      <TouchableOpacity
        {...props}
        style={[props.style, styles.tabButton, isTight && styles.buttonTight]}
      />
    </View>
  )
}
