import { ScaledSheet } from 'react-native-size-matters'
import Metrics from '../../../utils/Metrics'
import Fonts from '../../../fonts'
import Colors from '../../../utils/Colors'

const { textGray, blackGray, inputBorder } = Colors
const { baseMargin, doubleBaseMargin, cornerRadius, IS_IOS } = Metrics
const { size, type, style } = Fonts

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
    fontStyle: 'italic',
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
  center: {
    textAlign: 'center'
  },
  icon: {},
  darkMode: {
    color: 'white'
  }
})
