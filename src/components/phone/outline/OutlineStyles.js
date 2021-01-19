import { ScaledSheet } from 'react-native-size-matters'
import Metrics from '../../../utils/Metrics'
import Colors from '../../../utils/Colors'

const { section, baseMargin, doubleBaseMargin } = Metrics
const { borderGray } = Colors

export default ScaledSheet.create({
  content: {
    paddingVertical: 8
  },
  addScene: {
    fontSize: 16
  },
  chapterView: {
    backgroundColor: 'white',
    paddingHorizontal: doubleBaseMargin,
    paddingVertical: baseMargin / 2
  },
  sliderRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  renameButton: { flex: 0, height: '100%', width: 100 },
  trashButton: { flex: 0, height: '100%' },
  swipeContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: borderGray
  },
  chaptersList: { marginTop: -7 }
})
