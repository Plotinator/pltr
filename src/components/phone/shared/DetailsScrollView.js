import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

export default function DetailsScrollView (props) {
  return <ScrollView contentContainerStyle={styles.content}>
    { props.children }
  </ScrollView>
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 100, // space at the bottom (i noticed Notes on phones has almost a whole screen of padding at the bottom)
    backgroundColor: 'white',
  },
})
