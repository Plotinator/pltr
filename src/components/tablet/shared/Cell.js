import React, { forwardRef } from 'react'
import { View } from 'native-base'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { CELL_WIDTH, CELL_HEIGHT } from '../../../utils/constants'

const Cell = forwardRef((props, ref) => {
  if (props.onPress) {
    return <TouchableOpacity style={[styles.cell, props.style]} onPress={props.onPress} ref={ref} onLayout={props.onLayout}>
      { props.children }
    </TouchableOpacity>
  } else {
    return <View style={[styles.cell, props.style]} ref={ref} onLayout={props.onLayout}>
      { props.children }
    </View>
  }
})

const styles = StyleSheet.create({
  cell: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
  },
})

export default Cell
