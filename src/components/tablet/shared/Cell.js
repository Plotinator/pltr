import React, { Component } from 'react'
import { View } from 'native-base'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { CELL_WIDTH, CELL_HEIGHT } from '../../../utils/constants'

export default function Cell (props) {
  if (props.onPress) {
    return <TouchableOpacity style={[styles.cell, props.style]} onPress={props.onPress}>
      { props.children }
    </TouchableOpacity>
  } else {
    return <View style={[styles.cell, props.style]}>
      { props.children }
    </View>
  }
}

const styles = StyleSheet.create({
  cell: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
  },
})
