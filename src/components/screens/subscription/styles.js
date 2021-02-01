import { ScaledSheet } from 'react-native-size-matters'
import Metrics from '../../../utils/Metrics'

const { baseMargin, section } = Metrics

export default ScaledSheet.create({
  scroller: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: section,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  actionButtons: {
    minHeight: '150@vs',
    width: '90%',
    alignItems: 'center'
  },
  button: {
    marginTop: baseMargin * 1.5
  },
  emoji: {
    width: '80@ms',
    height: '80@ms',
    resizeMode: 'contain',
    marginVertical: baseMargin
  },
  loader: {
    height: '68@vs'
  }
})
