import React, { Component } from 'react'
import {
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Keyboard,
  View,
} from 'react-native'
import Metrics from '../../../utils/Metrics'

export default class DetailsScrollView extends Component {
  _setRef = (ref) => this.scroller = ref
  getScroller = () => this.scroller
  render () {
    const { children } = this.props
    return (
      <ScrollView contentContainerStyle={styles.content} ref={this._setRef}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>{children}</View>
        </TouchableWithoutFeedback>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: Metrics.doubleBaseMargin,
    backgroundColor: 'white'
  }
})
