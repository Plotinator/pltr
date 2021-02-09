import { ScaledSheet } from 'react-native-size-matters'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import Metrics from '../../../utils/Metrics'
import Colors from '../../../utils/Colors'
import Fonts from '../../../fonts'

const { baseMargin, doubleBaseMargin, section } = Metrics
const { style, size } = Fonts
const { lightGray, textLightGray, lighterGray } = Colors

export default ScaledSheet.create({
  container: {
    flex: 1,
    paddingTop: ifIphoneX(section, 0),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'hsl(210, 36%, 96%)'
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: section,
    marginTop: ifIphoneX(section, 0)
  },
  close: {
    resizeMode: 'contain',
    width: '15@ms',
    height: '15@ms',
    tintColor: textLightGray
  },
  logoContainer: {
    paddingTop: section,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: '80@ms',
    height: '150@vs',
    resizeMode: 'contain'
  },
  menu: {
    padding: doubleBaseMargin
  },
  button: {
    padding: baseMargin * 1.5,
    alignItems: 'center'
  },
  buttonText: {
    ...style.bold,
    fontSize: size.h4,
    letterSpacing: 1
  },
  emailText: {
    ...style.semiBold,
    fontSize: size.small,
    letterSpacing: 1,
    color: lightGray
  },
  logoutText: {
    ...style.semiBold,
    fontSize: size.small,
    color: lighterGray,
    letterSpacing: 1
  },
  version: {
    position: 'absolute',
    left: doubleBaseMargin,
    bottom: doubleBaseMargin
  },
  versionText: {
    fontSize: size.tiny,
    color: lighterGray,
    letterSpacing: 1
  }
})
