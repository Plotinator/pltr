import React from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'native-base'
import { colors } from 'pltr/v2'
import tinycolor from 'tinycolor2'
import { Text, ShellButton } from './common'

export default function ColorPickerList ({ chooseColor }) {
  const renderColorList = list => {
    return list.map(c => {
      const color = tinycolor(c)
      const hexVal = color.toHexString()
      const backgroundColor = { backgroundColor: hexVal }
      return (
        <ShellButton data={c} key={c} onPress={chooseColor}>
          <View style={[styles.colorSwatch, backgroundColor]} />
        </ShellButton>
      )
    })
  }

  const renderColorGroups = () => {
    return colors.colorsWithKeys.map(obj => {
      return (
        <View style={styles.groupWrapper} key={obj.title}>
          <Text fontStyle='semiBold' style={styles.h3}>
            {obj.title}
          </Text>
          <View style={styles.colorGroup}>{renderColorList(obj.colors)}</View>
        </View>
      )
    })
  }

  return <View style={styles.wrapper}>{renderColorGroups()}</View>
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 8
  },
  groupWrapper: {
    marginVertical: 4
  },
  colorGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  h3: {
    marginVertical: 4,
    marginLeft: 8
  },
  colorSwatch: {
    width: 60,
    height: 50,
    margin: 8,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10
  }
})
