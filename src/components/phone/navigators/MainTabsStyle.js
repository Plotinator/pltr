import { ScaledSheet } from 'react-native-size-matters'
import Fonts from '../../../fonts'
import Metrics from '../../../utils/Metrics'

const {
  IS_ANDROID,
  baseMargin,
  doubleBaseMargin,
  section,
  footerHeight
} = Metrics

const { size, style, type } = Fonts

export default ScaledSheet.create({
  tabContainer: {
    height: footerHeight
  },
  tabButton: {
    padding: baseMargin,
    paddingHorizontal: baseMargin / 2,
  },
  tabLabel: {
    ...style.semiBoldText,
    fontSize: size.h7
  },
  tabIcon: {
    minWidth: 40,
    textAlign: 'center'
  }
})
