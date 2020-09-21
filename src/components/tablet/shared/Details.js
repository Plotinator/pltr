import React from 'react'
import { View, Form, Label, Input } from 'native-base'
import { StyleSheet, ScrollView } from 'react-native'

export function DetailsWrapper (props) {

  return <View style={styles.detailsWrapper}>
    <View style={styles.detailsInner}>
      <View style={styles.contentWrapper}>
        <View style={styles.content}>
          <Form style={styles.form}>
            { props.children }
          </Form>
        </View>
      </View>
    </View>
  </View>
}

export function DetailsLeft (props) {
  return <View style={styles.formLeft}><ScrollView>{ props.children }</ScrollView></View>
}

export function DetailsRight (props) {
  return <View style={styles.formRight}>
    <View style={styles.formRightInner}>
      { props.children }
    </View>
  </View>
}

const styles = StyleSheet.create({
  detailsWrapper: {
    padding: 16,
    flex: 1,
  },
  detailsInner: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  contentWrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  form: {
    flex: 1,
    flexDirection: 'row',
  },
  formRight: {
    flex: 0.25,
    paddingLeft: 8,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'hsl(210, 36%, 96%)', //gray-9
  },
  formRightInner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  formLeft: {
    flex: 0.75,
    paddingHorizontal: 16,
  },
})
