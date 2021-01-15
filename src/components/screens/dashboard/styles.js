import { ScaledSheet } from 'react-native-size-matters'
import Fonts from '../../../fonts'
import Metrics from '../../../utils/Metrics'

const {
  screenHeight,
  baseMargin,
  doubleBaseMargin,
  section,
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
    padding: section
  },
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: doubleBaseMargin
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
    width: 60,
    height: 30,
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
    marginTop: baseMargin,
    width: '80%'
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
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    marginTop: doubleBaseMargin
  }
})
