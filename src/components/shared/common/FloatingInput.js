import React, { Component } from 'react'
import Text from './Text'
import Input from './Input'
import * as Animatable from 'react-native-animatable'
import styles from './InputStyles'

export default class FloatingInput extends Component {
  state = {
    focused: false
  }

  setFocus = (event) => {
    const { onFocus } = this.props
    onFocus && onFocus(event)
    this.setState({ focused: true })
  }

  setBlur = (event) => {
    const { onBlur } = this.props
    onBlur && onBlur(event)
    this.setState({ focused: false })
  }

  render () {
    const { focused } = this.state
    const { value, labelStyle, labelText, labelTextStyle } = this.props
    const shouldStayUp = focused || (!focused && value)
    return (
      <Animatable.View>
        <Animatable.View
          transition={['marginBottom', 'marginTop']}
          duration={800}
          easing='ease-out-expo'
          style={[
            labelStyle,
            shouldStayUp ? styles.labelUp : styles.labelDown
          ]}>
          <Text center gray style={labelTextStyle}>
            {labelText}
          </Text>
        </Animatable.View>
        <Input {...this.props} onFocus={this.setFocus} onBlur={this.setBlur} />
      </Animatable.View>
    )
  }
}
