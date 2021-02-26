import { ScaledSheet } from 'react-native-size-matters'
import Metrics from '../../../utils/Metrics'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const { baseMargin, doubleBaseMargin, doubleSection } = Metrics

export default ScaledSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: ifIphoneX(doubleSection, doubleBaseMargin)
  },
  logo: {
    height: '100@ms',
    width: '80@ms',
    resizeMode: 'contain',
    marginBottom: baseMargin
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: baseMargin / 2
  },
  logoText: {
    width: '70@ms',
    height: '30@ms',
    resizeMode: 'contain',
    marginLeft: '7@ms'
  }
})
