import { moderateScale } from 'react-native-size-matters'

export const type = {
  light: 'OpenSans-Light',
  lightItalic: 'OpenSans-LightItalic',
  regular: 'OpenSans-Regular',
  italic: 'OpenSans-Italic',
  semiBold: 'OpenSans-SemiBold',
  semiBoldItalic: 'OpenSans-SemiBoldItalic',
  bold: 'OpenSans-Bold',
  boldItalic: 'OpenSans-BoldItalic',
  extraBold: 'OpenSans-ExtraBold',
  extraBoldItalic: 'OpenSans-ExtraBoldItalic'
}

export const size = {
  h0: moderateScale(26),
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
  light: {
    fontFamily: type.light,
    fontWeight: '300'
  },
  lightItalic: {
    fontFamily: type.lightItalic,
    fontWeight: '300',
    fontStyle: 'italic'
  },
  regular: {
    fontFamily: type.regular,
    fontWeight: '400'
  },
  italic: {
    fontFamily: type.italic,
    fontWeight: '400',
    fontStyle: 'italic'
  },
  semiBold: {
    fontFamily: type.semiBold,
    fontWeight: '500'
  },
  semiBoldItalic: {
    fontFamily: type.semiBoldItalic,
    fontWeight: '500',
    fontStyle: 'italic'
  },
  bold: {
    fontFamily: type.bold,
    fontWeight: '700'
  },
  boldItalic: {
    fontFamily: type.boldItalic,
    fontWeight: '700',
    fontStyle: 'italic'
  },
  extraBold: {
    fontFamily: type.extraBold,
    fontWeight: '900'
  },
  extraBoldItalic: {
    fontFamily: type.extraBoldItalic,
    fontWeight: '900',
    fontStyle: 'italic'
  },
  inputText: {
    fontFamily: type.semiBold,
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
