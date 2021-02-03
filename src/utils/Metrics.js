import { Dimensions, Platform } from 'react-native'
import {
  verticalScale,
  moderateVerticalScale,
  moderateScale
} from 'react-native-size-matters'

const { width, height } = Dimensions.get('window')
const IS_IOS = Platform.OS === 'ios'
const ifIOS = (is, isnt) => (IS_IOS ? is : isnt)

const Metrics = {
  IS_IOS,
  IS_ANDROID: !IS_IOS,
  ifIOS,
  section: moderateVerticalScale(25),
  baseMargin: moderateVerticalScale(10),
  doubleSection: moderateVerticalScale(50),
  doubleBaseMargin: moderateVerticalScale(20),
  screenWidth: width < height ? width : height - ifIOS(0, 23),
  screenHeight: width < height ? height - ifIOS(0, 23) : width,
  headerHeight: moderateVerticalScale(70),
  footerHeight: moderateVerticalScale(70),
  buttonRadius: moderateScale(12),
  cornerRadius: moderateScale(8)
}

export default Metrics
