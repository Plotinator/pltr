import { ScaledSheet } from 'react-native-size-matters'
import Metrics from '../../../utils/Metrics'
import Fonts from '../../../fonts'
import Colors from '../../../utils/Colors'

const { baseMargin, doubleBaseMargin, buttonRadius } = Metrics
const { style } = Fonts
const { orange, white } = Colors

export default ScaledSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: doubleBaseMargin,
    borderRadius: buttonRadius,
    backgroundColor: orange
  },
  textWrapper: {
    paddingVertical: baseMargin * 1.5
  },
  text: {
    ...style.buttonText,
    color: white
  },
  bordered: {
    borderWidth: 0.5,
    borderColor: 'lightgray'
  },
  block: {
    width: '100%'
  }
})
