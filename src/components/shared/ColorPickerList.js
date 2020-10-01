import React from 'react'
import { StyleSheet } from 'react-native'
import { View, Text, Container, Content, Form, Input, Label, Item, Button, Icon, H3 } from 'native-base'
import { colors } from 'pltr/v2'
import tinycolor from 'tinycolor2'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function ColorPickerList (props) {

  const renderColorList = (list) => {
    return list.map(c => {
      const color = tinycolor(c)
      const hexVal = color.toHexString()
      const backgroundColor = {backgroundColor: hexVal}
      return <TouchableOpacity key={c} onPress={() => props.chooseColor(c)}>
        <View style={[styles.colorSwatch, backgroundColor]}></View>
      </TouchableOpacity>
    })
  }

  const renderColorGroups = () => {
    return colors.colorsWithKeys.map(obj => {
      return <View style={styles.groupWrapper} key={obj.title}>
        <H3 style={styles.h3}>{obj.title}</H3>
        <View style={styles.colorGroup}>
          { renderColorList(obj.colors) }
        </View>
      </View>
    })
  }

  return <View style={styles.wrapper}>{ renderColorGroups() }</View>
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 8,
  },
  groupWrapper: {
    marginVertical: 4,
  },
  colorGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  h3: {
    marginVertical: 4,
    marginLeft: 8,
  },
  colorSwatch: {
    width: 60,
    height: 50,
    margin: 8,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
  }
})
