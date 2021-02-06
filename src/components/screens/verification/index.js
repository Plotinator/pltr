import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  View,
  Image,
  Linking,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
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

class Verification extends Component {
  state = {
    email: '',
    submitted: false
  }

  componentDidUpdate () {
    const { user, navigation, verifying } = this.props
    const { submitted } = this.state
    if (submitted && !verifying && user && user.email && !user.verified) {
      // email valid now lets confirm
      navigation.navigate('VerificationConfirmation')
      this.setState({ submitted: false })
    }
  }

  handleEmailValidation = () => {
    const { email } = this.state
    const {
      route: {
        params: { verifyLicense }
      }
    } = this.props
    verifyLicense(email)
    this.setState({ submitted: true })
  }

  handleEmailText = email => this.setState({ email })

  handleGetLicense () {
    Linking.openURL('https://plottr.com/pricing/')
  }

  handleGoToSubscriptions = () => {
    const { navigation } = this.props
    navigation.navigate('Subscription')
  }

  renderSubscriptionButtons(verifying) {
    if (Platform.OS !== 'ios') return null

    return <>
      <View style={styles.or}>
        <Text fontStyle={'bold'}>{t('or')}</Text>
      </View>
      <Button
        block
        disabled={verifying}
        style={styles.button}
        onPress={this.handleGoToSubscriptions}>
        {t('START MOBILE SUBSCRIPTION')}
      </Button>
    </>
  }

  render() {
    const { email } = this.state
    const { verifying, route } = this.props
    const {
      params: { logout, verifyLicense }
    } = route
    const isValidEmail = email && String(email).match(
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    )

    return (
      <ScrollView
        contentContainerStyle={styles.scroller}
        showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback>
          <View style={styles.container}>
            <WelcomeToPlottr>
              <Text black fontStyle='bold' fontSize='h3' center>
                {t("Let's verify your license.")}
              </Text>
              <Text black fontSize='h4' center>
                {t('We will email you a verification code.')}
              </Text>
            </WelcomeToPlottr>
            <Animatable.View
              delay={100}
              duration={1000}
              animation='fadeInUp'
              easing='ease-out-expo'
              style={styles.formSection}>
              <Input
                friendly
                value={email}
                disabled={verifying}
                placeholder={t('Email').toUpperCase()}
                onChangeText={this.handleEmailText}
                autoCompleteType='email'
                autoCapitalize='none'
                keyboardType='email-address'
              />
              <Button
                block
                buttonColor='green'
                style={styles.button}
                disabled={verifying || !isValidEmail}
                onPress={this.handleEmailValidation}>
                {t(verifying ? 'CHECKING...' : 'CHECK EMAIL')}
              </Button>
            </Animatable.View>
            <Animatable.View
              delay={170}
              duration={1000}
              animation='fadeInUp'
              easing='ease-out-expo'
              style={styles.dontHaveLicense}>
              <Text black fontStyle='bold' fontSize='h4'>
                {t("Don't have a license?")}
              </Text>
            </Animatable.View>
            <Animatable.View
              delay={150}
              duration={1000}
              animation='fadeInUp'
              easing='ease-out-expo'
              style={styles.actionButtons}>
              <Button
                block
                buttonColor='blue'
                style={styles.button}
                onPress={this.handleGetLicense}>
                {t('GET A LICENSE')}
              </Button>
              {this.renderSubscriptionButtons(verifying)}
              <GoToPlottrDotCom />
            </Animatable.View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    )
  }
}

const mapStateToProps = ({ data: { user, verifying } }) => {
  return { user, verifying }
}

export default connect(mapStateToProps)(Verification)
