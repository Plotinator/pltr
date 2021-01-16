import { Dimensions, Platform } from 'react-native'
import { verticalScale, moderateScale } from 'react-native-size-matters'

const { width, height } = Dimensions.get('window')
const IS_IOS = Platform.OS === 'ios'
const ifIOS = (is, isnt) => (IS_IOS ? is : isnt)

const Metrics = {
  IS_IOS,
  IS_ANDROID: !IS_IOS,
  ifIOS,
  section: moderateScale(25),
  baseMargin: moderateScale(10),
  doubleSection: moderateScale(50),
  doubleBaseMargin: moderateScale(20),
  screenWidth: width < height ? width : height - ifIOS(0, 23),
  screenHeight: width < height ? height - ifIOS(0, 23) : width,
  headerHeight: verticalScale(70),
  footerHeight: verticalScale(70),
  buttonRadius: moderateScale(14),
  cornerRadius: moderateScale(9)
}

export default Metrics
