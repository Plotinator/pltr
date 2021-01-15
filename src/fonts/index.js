import { moderateScale } from 'react-native-size-matters'

export const type = {
  light: 'OpenSans-Light',
  lightItalic: 'OpenSans-LightItalic',
  regular: 'OpenSans-Regular',
  regularItalic: 'OpenSans-RegularItalic',
  semiBold: 'OpenSans-SemiBold',
  semiBoldItalic: 'OpenSans-SemiBoldItalic',
  bold: 'OpenSans-Bold',
  boldItalic: 'OpenSans-BoldItalic',
  extraBold: 'OpenSans-ExtraBold',
  extraBoldItalic: 'OpenSans-ExtraBoldItalic'
}

export const size = {
  h0: moderateScale(25),
  h1: moderateScale(22),
  h2: moderateScale(20),
  h3: moderateScale(18),
  h4: moderateScale(16),
  h5: moderateScale(14),
  h6: moderateScale(12),
  h7: moderateScale(10),
  h8: moderateScale(8),
  input: moderateScale(17),
  large: moderateScale(20),
  medium: moderateScale(18),
  regular: moderateScale(16),
  small: moderateScale(12),
  tiny: moderateScale(10),
  micro: moderateScale(8),
  nano: moderateScale(7)
}

export const style = {
  regular: {
    fontFamily: type.regular
  },
  italic: {
    fontFamily: type.regularItalic
  },
  light: {
    fontFamily: type.light
  },
  lightItalic: {
    fontFamily: type.lightItalic
  },
  semiBold: {
    fontFamily: type.semiBold
  },
  semiBoldItalic: {
    fontFamily: type.semiBoldItalic
  },
  bold: {
    fontFamily: type.bold
  },
  boldItalic: {
    fontFamily: type.boldItalic
  },
  extraBold: {
    fontFamily: type.extraBold
  },
  extraBoldItalic: {
    fontFamily: type.extraBoldItalic
  },
  inputText: {
    fontFamily: type.regular,
    fontSize: size.input
  },
  normalText: {
    fontFamily: type.regular,
    fontSize: size.regular
  },
  semiBoldText: {
    fontFamily: type.semiBold,
    fontSize: size.regular
  },
  boldText: {
    fontFamily: type.bold,
    fontSize: size.regular
  },
  smallText: {
    fontFamily: type.regular,
    fontSize: size.small
  },
  tinyText: {
    fontFamily: type.regular,
    fontSize: size.tiny
  },
  microText: {
    fontFamily: type.regular,
    fontSize: size.micro
  },
  buttonText: {
    fontFamily: type.bold,
    fontSize: size.regular
  }
}

export default {
  type,
  size,
  style
}
