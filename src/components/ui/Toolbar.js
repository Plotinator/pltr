import React from 'react'
import { View } from 'native-base'
import { StyleSheet } from 'react-native'

export default function Toolbar (props) {
  return <View style={styles.container} elevation={2}>
    { props.children }
  </View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: 'hsl(212, 33%, 89%)', //gray-8
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'hsl(211, 27%, 70%)', //gray-6
    borderRadius: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  }
})