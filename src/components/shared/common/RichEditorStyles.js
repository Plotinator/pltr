import { ScaledSheet } from 'react-native-size-matters'
import Metrics from '../../../utils/Metrics'
import Colors from '../../../utils/Colors'

export default ScaledSheet.create({
  editorContainer: {
    borderWidth: 1,
    borderColor: Colors.borderGray,
    borderRadius: Metrics.cornerRadius,
    paddingBottom: Metrics.baseMargin / 2
  },
  richToolbar: {
    alignItems: 'flex-start',
    backgroundColor: Colors.cloud,
    borderRadius: Metrics.cornerRadius,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: Metrics.baseMargin / 2
  },
  richEditor: {
    borderRadius: Metrics.cornerRadius,
    minHeight: 50
  }
})
