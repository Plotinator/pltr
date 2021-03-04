import { ScaledSheet } from 'react-native-size-matters'
import Metrics from '../../../utils/Metrics'

const {
  baseMargin,
  doubleBaseMargin,
  section,
  screenHeight,
  buttonRadius
} = Metrics

export default ScaledSheet.create({
  scroller: {
    backgroundColor: 'white',
    height: screenHeight
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
    maxWidth: '300@ms',
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
    // minHeight: '150@vs',
    width: '90%',
    maxWidth: '300@ms',
    justifyContent: 'center',
    alignItems: 'center'
  },
  or: {
    marginTop: baseMargin / 2,
    marginBottom: -baseMargin
  },
  button: {
    marginTop: baseMargin * 1.5
  },
  licenseButton: {
    width: '100%',
    marginTop: doubleBaseMargin,
    borderRadius: buttonRadius,
    borderWidth: 2
  },
  licenseHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: baseMargin,
    paddingVertical: baseMargin / 2
  },
  licenseRow: {
    paddingVertical: baseMargin / 2,
    paddingHorizontal: baseMargin,
    backgroundColor: 'white',
    borderTopWidth: 2
  },
  licenseSelect: {
    alignItems: 'center',
    paddingVertical: baseMargin
  }
})
