import { ScaledSheet } from 'react-native-size-matters'
import Metrics from '../../../utils/Metrics'

const {
  baseMargin,
  doubleBaseMargin,
  section,
  doubleSection,
  cornerRadius
} = Metrics

export default ScaledSheet.create({
  scroller: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: section,
    justifyContent: 'center',
    alignItems: 'center'
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
    maxWidth: 400,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    marginTop: doubleBaseMargin
  },
  logout: {
    paddingTop: doubleSection
  }
})
