import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Metrics from '../../../utils/Metrics'

const AnimatableTouchableOpacity = Animatable.createAnimatableComponent(
  TouchableOpacity
)
const { baseMargin } = Metrics

export default class ShellButton extends Component {
  render () {
    const {
      style,
      faded,
      padded,
      children,
      disabled,
      noninteractive
    } = this.props
    const stylesArray = [style]

    if (disabled || faded) stylesArray.push({ opacity: 0.5 })
    if (padded) stylesArray.push({ padding: baseMargin })

    return (
      <AnimatableTouchableOpacity
        {...this.props}
        style={stylesArray}
        disabled={disabled || noninteractive}>
        {children}
      </AnimatableTouchableOpacity>
    )
  }
}
