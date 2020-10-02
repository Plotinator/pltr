import React, { useRef, useEffect } from 'react'
import { View } from 'native-base'
import tinycolor from 'tinycolor2'
import { StyleSheet } from 'react-native'
import Cell from '../shared/Cell'
import { useRegisterCoordinates } from './hooks'

export function BlankCell (props) {
  const [cellRef, measure] = useRegisterCoordinates(props.register, props.chapterId, props.lineId, true)

  const onLayout = () => measure()

  const { color } = props
  const colorObj = tinycolor(color)
  return <Cell style={styles.cell} ref={cellRef} onLayout={onLayout}>
    <View style={[styles.coloredLine, {borderColor: colorObj.toHexString()}]}/>
  </Cell>
}

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
  },
  coloredLine: {
    width: '100%',
    borderWidth: 1,
  },
})
