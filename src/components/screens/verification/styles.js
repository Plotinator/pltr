import { ScaledSheet } from 'react-native-size-matters'
import Metrics from '../../../utils/Metrics'

const { baseMargin, doubleBaseMargin, section } = Metrics

export default ScaledSheet.create({
  scroller: {
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    padding: section,
    justifyContent: 'center',
    alignItems: 'center'
  },
  formSection: {
    paddingTop: baseMargin * 1.5,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dontHaveLicense: {
    marginTop: doubleBaseMargin,
    marginBottom: -baseMargin
  },
  emailVerification: {
    alignItems: 'center',
    marginTop: baseMargin
  },
  actionButtons: {
    minHeight: '150@vs',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  or: {
    marginTop: baseMargin / 2,
    marginBottom: -baseMargin
  },
  button: {
    marginTop: baseMargin * 1.5
  }
})
