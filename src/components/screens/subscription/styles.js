import { ScaledSheet } from 'react-native-size-matters'
import Metrics from '../../../utils/Metrics'
import Fonts from '../../../fonts'
import Colors from '../../../utils/Colors'

const { baseMargin, section, buttonRadius, doubleBaseMargin } = Metrics
const { style, size } = Fonts
const { white, grayBlack } = Colors

export default ScaledSheet.create({
  scroller: {
    flex: 1
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
    maxWidth: '300@ms',
    alignItems: 'center'
  },
  button: {
    marginTop: baseMargin * 1.5
  },
  subButton: {
    width: '100%',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: buttonRadius,
    marginTop: baseMargin * 1.5
  },
  buttonText: {
    flex: 1,
    paddingHorizontal: doubleBaseMargin,
    paddingVertical: baseMargin * 1.35,
    alignItems: 'center',
    ...style.buttonText,
    color: white
  },
  badge: {
    paddingVertical: baseMargin,
    backgroundColor: grayBlack,
    borderRadius: buttonRadius,
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  termText: {
    fontSize: size.tiny,
    lineHeight: size.tiny
  },
  emoji: {
    width: '80@ms',
    height: '80@ms',
    resizeMode: 'contain',
    marginVertical: baseMargin
  },
  loader: {
    height: '68@vs'
  },
  footNote: {
    marginTop: baseMargin * 1.5
  },
  inline: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  link: {
    padding: baseMargin / 4
  }
})
