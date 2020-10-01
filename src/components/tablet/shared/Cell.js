import React, { Component } from 'react'
import { View } from 'native-base'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { CELL_WIDTH, CELL_HEIGHT } from '../../../utils/constants'

export class Cell extends Component {
  render () {
    return <TouchableOpacity style={[styles.cell, this.props.style]} onPress={this.props.onPress}>
      { this.props.children }
    </TouchableOpacity>
  }
}

const styles = StyleSheet.create({
  cell: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
  },
})
