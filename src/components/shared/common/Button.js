import React, { Component } from 'react'
import { TouchableOpacity, View } from 'react-native'
import styles from './ButtonStyles'
import Text from './Text'
import Colors from '../../../utils/Colors'
import * as Animatable from 'react-native-animatable'

const AnimatableTouchableOpacity = Animatable.createAnimatableComponent(
  TouchableOpacity
)

export default class Button extends Component {
  render () {
    const {
      style,
      block,
      textStyle,
      buttonText,
      children,
      onPress,
      faded,
      disabled,
      bordered,
      buttonColor,
      wrapperStyle,
      fontStyle = 'bold',
      fontSize = 'regular'
    } = this.props
    const stylesArray = [styles.button]
    const textStylesArray = [styles.text]
    const wrapperStylesArray = [styles.textWrapper]
    const buttonTextRender = buttonText || children

    if (style) stylesArray.push(style)
    if (block) stylesArray.push(styles.block)
    if (textStyle) textStylesArray.push(textStyle)
    if (bordered) stylesArray.push(styles.bordered)
    if (wrapperStyle) wrapperStylesArray.push(wrapperStyle)
    if (disabled || faded) stylesArray.push(styles.disabled)
    if (buttonColor) {
      stylesArray.push({ backgroundColor: Colors[buttonColor] || buttonColor })
    }

    return (
      <AnimatableTouchableOpacity
        {...this.props}
        style={stylesArray}
        onPress={onPress}
        disabled={disabled}>
        <View style={wrapperStylesArray}>
          <Text
            fontStyle={fontStyle}
            fontSize={fontSize}
            style={textStylesArray}>
            {buttonTextRender}
          </Text>
        </View>
      </AnimatableTouchableOpacity>
    )
  }
}
