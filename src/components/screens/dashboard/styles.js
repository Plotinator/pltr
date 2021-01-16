import { ScaledSheet } from 'react-native-size-matters'
import Fonts from '../../../fonts'
import Metrics from '../../../utils/Metrics'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const {
  screenHeight,
  baseMargin,
  doubleBaseMargin,
  section,
  doubleSection,
  cornerRadius
} = Metrics

const {
  size,
  style,
  type: { regular }
} = Fonts

export default ScaledSheet.create({
  container: {
    flex: 1,
    padding: section,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: ifIphoneX(doubleSection, 0)
  },
  logo: {
    height: '100@ms',
    width: '80@ms',
    resizeMode: 'contain',
    marginBottom: baseMargin
  },
  welcomeSection: {
    flexDirection: 'row'
  },
  logoText: {
    width: '60@ms',
    height: '30@ms',
    resizeMode: 'contain',
    marginLeft: 5
  },
  recentFiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: cornerRadius,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: doubleBaseMargin,
    paddingTop: doubleBaseMargin,
    paddingBottom: baseMargin,
    marginTop: baseMargin,
    width: '80%'
  },
  or: {
    marginTop: baseMargin,
    marginBottom: -baseMargin
  },
  project: {
    width: '50%',
    alignItems: 'center',
    marginBottom: baseMargin,
    paddingHorizontal: baseMargin / 2,
    paddingBottom: baseMargin / 2
  },
  fileIcon: {
    width: '70@ms',
    height: '70@ms',
    resizeMode: 'contain'
  },
  actionButtons: {
    minHeight: '150@vs',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    marginTop: doubleBaseMargin
  }
})
