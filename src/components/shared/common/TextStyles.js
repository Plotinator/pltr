import { StyleSheet } from 'react-native'
import Fonts from '../../../fonts'
import Metrics from '../../../utils/Metrics'

const { IS_IOS, baseMargin, doubleBaseMargin, section } = Metrics

const {
  size,
  style,
  type: { regular }
} = Fonts

export default StyleSheet.create({
  underlined: {
    textDecorationLine: 'underline'
  },
  gray: {
    color: 'gray'
  },
  black: {
    color: '#333333'
  },
  white: {
    color: 'white'
  },
  faded: {
    opacity: 0.5
  },
  paragraph: {
    paddingVertical: doubleBaseMargin
  },
  nobase: {
    paddingBottom: 0
  },
  flex: {
    flex: 1
  },
  center: {
    justifyContent: 'center',
    textAlign: 'center'
  },
  wrap: {
    width: '100%',
    flexWrap: 'wrap'
  },
  padded: {
    padding: baseMargin
  },
  xPadded: {
    padding: section
  },
  spaced: {
    justifyContent: 'space-between'
  }
})
