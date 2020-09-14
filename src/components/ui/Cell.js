import React, { Component } from 'react'
import { View } from 'native-base'
import { StyleSheet, TouchableOpacity } from 'react-native'

const CELL_WIDTH = 150
const CELL_HEIGHT = 93

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
