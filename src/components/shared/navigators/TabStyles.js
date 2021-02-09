import { ScaledSheet } from 'react-native-size-matters'
import Fonts from '../../../fonts'
import Metrics from '../../../utils/Metrics'
import { isTablet } from 'react-native-device-info'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const { baseMargin, doubleBaseMargin, footerHeight, IS_IOS } = Metrics

const { size, style } = Fonts

export default ScaledSheet.create({
  tabContainer: {
    height: footerHeight,
    paddingBottom: isTablet() ? baseMargin / (IS_IOS ? 1 : 2) : 0
  },
  tabButton: {
    padding: baseMargin,
    paddingHorizontal: baseMargin / 2,
    paddingBottom: ifIphoneX(doubleBaseMargin, baseMargin)
  },
  tabLabel: {
    ...style.semiBoldText,
    fontSize: size.h7
  },
  tabIcon: {
    minWidth: 40,
    textAlign: 'center'
  },
  buttonFlex: { flex: 1 },
  buttonTight: {
    paddingTop: 0,
    marginBottom: -baseMargin / 2
  }
})
