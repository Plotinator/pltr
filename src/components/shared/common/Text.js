import React, { Component } from 'react'
import { Text as RNText } from 'react-native'
import styles from './TextStyles'
import Fonts from '../../../fonts'

const { size: fontSizes, style: fontStyles, type: fontTypes } = Fonts

export default class Text extends Component {
  render () {
    const {
      props,
      props: {
        style,
        typeFace = 'regular',
        fontSize = 'regular',
        fontStyle = 'regular',
        faded,
        flex,
        wrap,
        gray,
        white,
        color,
        center,
        nobase,
        padded,
        xPadded,
        spaced,
        leading,
        children,
        underlined,
        paragraph
      }
    } = this
    const compStyles = []

    if (typeFace) {
      compStyles.push({ fontFamily: fontTypes[typeFace] || typeFace })
    }
    if (fontStyle) {
      compStyles.push({ fontFamily: fontTypes[fontStyle] || fontStyle })
    }
    if (fontSize) {
      compStyles.push({ fontSize: fontSizes[fontSize] || fontSize })
    }
    if (color) {
      compStyles.push({ color })
    }
    if (faded) compStyles.push(styles.faded)
    if (flex) compStyles.push(styles.flex)
    if (gray) compStyles.push(styles.gray)
    if (white) compStyles.push(styles.white)
    if (underlined) compStyles.push(styles.underlined)
    if (paragraph) compStyles.push(styles.paragraph)
    if (nobase) compStyles.push(styles.nobase)
    if (center) compStyles.push(styles.center)
    if (wrap) compStyles.push(styles.wrap)
    if (spaced) compStyles.push(styles.spaced)
    if (padded) compStyles.push(styles.padded)
    if (xPadded) compStyles.push(styles.xPadded)
    if (leading) compStyles.push({ lineHeight: leading })

    compStyles.push(style)

    return (
      <RNText {...props} style={compStyles}>
        {children}
      </RNText>
    )
  }
}
