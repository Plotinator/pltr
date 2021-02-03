import { ScaledSheet } from 'react-native-size-matters'
import Fonts from '../../../fonts'
import Metrics from '../../../utils/Metrics'
import { isTablet } from 'react-native-device-info'

const { baseMargin, footerHeight, IS_IOS } = Metrics
const isIPAD = IS_IOS && isTablet()

const { size, style } = Fonts

export default ScaledSheet.create({
  tabContainer: {
    height: footerHeight,
    paddingBottom: isIPAD ? baseMargin : 0
  },
  tabButton: {
    padding: baseMargin,
    paddingHorizontal: baseMargin / 2
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
