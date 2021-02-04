import { ScaledSheet } from 'react-native-size-matters'
import Metrics from '../../../utils/Metrics'
import Colors from '../../../utils/Colors'
import { isTablet } from 'react-native-device-info'
import Fonts from '../../../fonts'

const { size } = Fonts
const { section, baseMargin, cornerRadius } = Metrics

const { gray } = Colors

export default ScaledSheet.create({
  book: {
    width: isTablet() ? '33%' : '66%'
  },
  bookImage: {
    width: '100%',
    aspectRatio: 0.8
  },
  titleWrapper: {
    flex: 2,
    paddingTop: '10%',
    paddingRight: '20%',
    paddingBottom: '10%',
    paddingLeft: '7%',
    alignItems: 'center'
  },
  bookTitle: {
    width: '100%',
    fontSize: size[isTablet() ? 'h6' : 'h3']
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: '10%',
    paddingRight: '22%',
    paddingBottom: '25%',
    alignItems: 'center'
  },
  centerButtons: {
    justifyContent: 'center'
  },
  button: {
    paddingVertical: baseMargin / 2,
    paddingHorizontal: baseMargin,
    backgroundColor: gray,
    borderRadius: cornerRadius
  }
})
