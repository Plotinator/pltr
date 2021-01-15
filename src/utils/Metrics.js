import { Dimensions, Platform } from 'react-native'
import { verticalScale } from 'react-native-size-matters'

const { width, height } = Dimensions.get('window')
const IS_IOS = Platform.OS === 'ios'
const ifIOS = (is, isnt) => (IS_IOS ? is : isnt)

const Metrics = {
  IS_IOS,
  IS_ANDROID: !IS_IOS,
  ifIOS,
  section: 25,
  baseMargin: 10,
  doubleSection: 50,
  doubleBaseMargin: 20,
  screenWidth: width < height ? width : height - ifIOS(0, 23),
  screenHeight: width < height ? height - ifIOS(0, 23) : width,
  headerHeight: verticalScale(70),
  footerHeight: verticalScale(70),
  buttonRadius: 8
}

export default Metrics
