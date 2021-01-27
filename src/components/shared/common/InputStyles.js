import { ScaledSheet } from 'react-native-size-matters'
import Metrics from '../../../utils/Metrics'
import Fonts from '../../../fonts'
import Colors from '../../../utils/Colors'

const {
  textGray,
  blackGray,
  inputWhite,
  inputBorderWhite,
  inputBorder
} = Colors
const { baseMargin, doubleBaseMargin, cornerRadius, IS_IOS } = Metrics
const { size, style } = Fonts

export default ScaledSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: inputBorder
  },
  input: {
    ...style.inputText,
    color: textGray,
    paddingVertical: IS_IOS ? 5 : null,
    fontSize: size.h4,
    flex: 1
  },
  bordered: {
    borderColor: inputBorder,
    borderRadius: cornerRadius,
    borderWidth: 0.5,
    paddingVertical: baseMargin / 2,
    paddingHorizontal: doubleBaseMargin,
    backgroundColor: blackGray
  },
  friendly: {
    backgroundColor: inputWhite,
    borderColor: inputBorderWhite,
    borderRadius: cornerRadius * 1.75,
    borderWidth: 1,
    paddingHorizontal: doubleBaseMargin
  },
  friendlyText: {
    textAlign: 'center',
    paddingVertical: baseMargin * 1.25
  },
  center: {
    textAlign: 'center'
  },
  icon: {},
  darkMode: {
    color: 'white'
  }
})
