import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  View,
  Image,
  Linking,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native'
import styles from './styles'
import {
  Text,
  ShellButton,
  Input,
  Button,
  WelcomeToPlottr,
  GoToPlottrDotCom
} from '../../shared/common'
import images from '../../../images'
import * as Animatable from 'react-native-animatable'
import t from 'format-message'
import Metrics from '../../../utils/Metrics'
import Colors from '../../../utils/Colors'
import { checkLicense } from '../../../utils/user_info'
import { showAlert } from '../../shared/common/AlertDialog'

const { IS_ANDROID } = Metrics

const buttonColors = ['blue', 'green', 'orange', 'brightGreen', 'purple', 'red']

class Verification extends Component {
  state = {
    verifying: false,
    submitted: null
  }

  showError (message, useTranslation = true) {
    showAlert({
      title: t('UH-OH!'),
      message: useTranslation ? t(message) : message
    })
  }

  handleUseLicense = async (license) => {
    // use license only logic
    const { navigation, verifying, route: { params: { sendVerificationEmail } } } = this.props
    this.setState({ verifying: true, submitted: license })

    const [success, userInfo] = await checkLicense(license)
    if (success) {
      await sendVerificationEmail(userInfo)
      navigation.navigate('VerificationConfirmation')
    } else {
      const error = t("Your selected license failed verification. Try another one.")
      const hasMessage = userInfo && userInfo.message
      const message = (hasMessage ? `\n${hasMessage}` : '')
      this.showError(error + message, false)
    }

    this.setState({ verifying: false, submitted: null })
    console.log('license', license)
  }

  handleGoBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  renderLicenseButton = (license, i) => {
    const { verifying, submitted } = this.state
    const { licenses } = license
    const color = Colors[buttonColors[i]]
    const isSubmitted = submitted && submitted.ID == license.ID
    const buttonStyles = [
      styles.licenseButton,
      { borderColor: color, backgroundColor: color }
    ]
    return (
      <ShellButton
        data={license}
        key={i}
        block
        disabled={verifying}
        style={buttonStyles}
        onPress={this.handleUseLicense}>
        <View style={styles.licenseHead}>
          <Text white fontStyle='bold' fontSize='h3'>License #{i+1}</Text>
          <Text white fontStyle='semiBold'>
            {String(license.date).substring(0, 10)}
          </Text>
        </View>
        {licenses.map(({ name }) => (
          <View style={[styles.licenseRow, { borderTopColor: color }]}>
            <Text center color={color} fontSize='small' fontStyle='bold'>
              {name.replace('&#8211;', '–')}
            </Text>
          </View>
        ))}
        <View style={styles.licenseSelect}>
          <Text white fontStyle='bold' fontSize='h3'>
            {isSubmitted ? t('CHECKING...') : t('SELECT')}
          </Text>
        </View>
      </ShellButton>
    )
  }

  render() {
    const { route: { params: { Licenses } } } = this.props

    return (
      <ScrollView
        contentContainerStyle={styles.scroller}
        showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback>
          <View style={styles.container}>
            <WelcomeToPlottr>
              <Text black fontStyle='bold' fontSize='h3' center>
                {t("Which license should we use?")}
              </Text>
              <Text black fontSize='h4' center>
                {t('Select a license below to proceed.')}
              </Text>
            </WelcomeToPlottr>
            <Animatable.View
              delay={150}
              duration={1000}
              animation='fadeInUp'
              easing='ease-out-expo'
              style={styles.actionButtons}>
              {Licenses.map(this.renderLicenseButton)}
              <Button
                tight
                key={'back'}
                buttonColor='gray'
                style={styles.button}
                onPress={this.handleGoBack}>
                {t('Go Back')}
              </Button>
              {IS_ANDROID && <GoToPlottrDotCom />}
            </Animatable.View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    )
  }
}

const mapStateToProps = ({ data: { user } }) => {
  return { user }
}

export default connect(mapStateToProps)(Verification)
