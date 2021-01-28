import React, { Component, useEffect, useState } from 'react'
import {
  View,
  Keyboard,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  checkForActiveLicense,
  getUserVerification,
  checkStoredLicense,
  verifyUser,
  reset
} from '../utils/user_info'
import { sendVerificationEmail } from '../utils/api'
import AppErrorBoundary from './AppErrorBoundary'
import t from 'format-message'
import AlertDialog, { showAlert } from './shared/common/AlertDialog'
import Metrics from '../utils/Metrics'
import Main from './Main'
import { cloneDeep } from 'lodash'

const { IS_ANDROID } = Metrics

export default class App extends Component {
  state = {
    userInfo: null,
    verifying: false
  }

  componentDidMount () {
    this.retrieveUserSession()
  }

  setUserInfo(info, checkLicense) {
    const userInfo = info && cloneDeep(info)
    console.log('SETTING USER INFO:', userInfo)
    this.setState({ userInfo }, checkLicense && this.checkUserLicense)
  }

  setVerifying(verifying) {
    this.setState({ verifying })
  }

  showError (message) {
    showAlert({
      title: t('UH-OH!'),
      message: t(message)
    })
  }

  retrieveUserSession = async () => {
    const userInfo = await getUserVerification()
    this.setUserInfo(userInfo, true)
  }

  checkUserLicense = async () => {
    const {
      userInfo = {},
      userInfo: { verified, validLicense }
    } = this.state
    const wasVerifiedAndValid = verified && validLicense
    let isActive = false

    // if we have a user check lets check their license
    if (wasVerifiedAndValid) {
      isActive = await checkStoredLicense(userInfo)
    }

    if (wasVerifiedAndValid && !isActive) {
      // License was valid but is no longer active or valid
      // alert user (and perhaps unset user session data)
      this.showError('We found your user session but...')
      this.handleLogout()
      return
    }
  }

  handleLogout () {
    // unset user session
    reset()
    this.setUserInfo(null)
  }

  handleLicenseVerification = async (email) => {
    this.setVerifying(true)
    const [success, userInfo] = await checkForActiveLicense(email)
    if (success) {
      this.setUserInfo(userInfo)
      sendVerificationEmail(
        email,
        userInfo.idToVerify,
        this.handleEmailConfirmation
      )
    } else {
      this.setVerifying(false)
      this.showError(
        "That email didn't verify. Try again or another email." +
            '\n' + (userInfo && userInfo.message) || ''
      )
    }
  }

  handleEmailConfirmation = (error) => {
    this.setVerifying(false)
    if (error) {
      this.showError('Error sending email! Check your email and Try again.')
      this.setUserInfo(null)
    }
  }

  handleCodeVerification = async (code) => {
    const { userInfo } = this.state
    const codeVerified = code == userInfo.idToVerify

    this.setVerifying(true)
    if (codeVerified) {
      const [verified, verifiedUserInfo] = await verifyUser(userInfo)
      if (verified) {
        this.setUserInfo(verifiedUserInfo)
      } else {
        // unverified
        const unverifiedUser = verifiedUserInfo
        const noMoreActivations =
          unverifiedUser &&
          unverifiedUser.problem == 'no_activations_left' &&
          !unverifiedUser.hasActivationsLeft
        const reasonForError = noMoreActivations
          ? 'It looks like you have Plottr on the max number of devices already'
          : 'There was an error activating your license key on this device'

        console.log('FAIL', reasonForError, unverifiedUser)
        this.setUserInfo(null)
        this.showError(reason)
      }
    } else {
      this.showError("That code didn't verify. Try again.")
    }
    this.setVerifying(false)
  }

  handleAppReset = () => {
    this.setState(
      { userInfo: null, verifying: false },
      this.retrieveUserSession
    )
  }

  render () {
    const { userInfo, verifying } = this.state
    const flexContainer = { flex: 1 }

    console.log('userInfo', userInfo)
    return (
      <SafeAreaProvider>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            enabled
            behavior={IS_ANDROID ? '' : 'padding'}
            keyboardShouldPersistTaps={'always'}
            style={flexContainer}>
            <View style={flexContainer}>
              <StatusBar barStyle='dark-content' />
              <AppErrorBoundary reset={this.handleAppReset} recover={this.handleAppReset}>
                <Main
                  v2
                  user={userInfo}
                  loading={verifying}
                  logout={this.handleLogout}
                  verifyLicense={this.handleLicenseVerification}
                  verifyCode={this.handleCodeVerification} />
              </AppErrorBoundary>
              <AlertDialog />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaProvider>
    )
  }
}
