import React, { useEffect, useState } from 'react'
import { StyleSheet, View, StatusBar, Linking, NativeModules, Platform } from 'react-native'
const { DocumentBrowser } = NativeModules
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Content, Text, H1, H2, Form, Item, Input, Button, Label, Spinner, Toast, Root, Container } from 'native-base'
import { checkForActiveLicense, getUserVerification, verifyUser, reset, checkStoredLicense } from '../utils/user_info'
import Main from './Main'
import { sendVerificationEmail } from '../utils/api'
import t from 'format-message'
import locales from '../locales'
import AppErrorBoundary from './AppErrorBoundary'

t.setup({ translations: locales, locale: 'en' }) // different locales?

const App = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    let ignore = false

    async function fetchUserInfo() {
      // DEV: use the following to reset user info/verification
      // await reset()
      const fetchedInfo = await getUserVerification()
      // if (fetchedInfo) {
      //   console.log('USER_INFO', fetchedInfo)
      // }
      if (!fetchedInfo) {
        if (Platform.OS == 'ios') {
          DocumentBrowser.closeBrowser()
        } else if (Platform.OS == 'android') {
          NativeModules.AndroidDocumentBrowser.closeBrowser()
        }
      }
      if (!ignore) setUserInfo(fetchedInfo)
    }

    fetchUserInfo()
    return () => (ignore = true)
  }, [])

  useEffect(() => {
    async function checkLicenseIsStillActive() {
      const isActive = await checkStoredLicense()
      if (!isActive) {
        // TODO: show something if not active
      }
    }
    if (userInfo && userInfo.verified && userInfo.validLicense) {
      checkLicenseIsStillActive()
    }
  }, [userInfo])

  const logout = async () => {
    await reset()
    setUserInfo(null)
  }

  const resetOnError = () => {
    if (Platform.OS == 'ios') {
      DocumentBrowser.closeBrowser()
    } else if (Platform.OS == 'android') {
      NativeModules.AndroidDocumentBrowser.closeBrowser()
    }
  }

  const recoverFromError = () => {
    if (Platform.OS == 'ios') {
      DocumentBrowser.openBrowser()
    }
  }

  const verifyLicense = async () => {
    if (email == '') return
    setVerifying(true)
    const userInfo = await checkForActiveLicense(email)
    setVerifying(false)
    if (userInfo) {
      Toast.show({
        text: t('Success!'),
        duration: 3000,
        type: 'success',
      })
      setUserInfo(userInfo)

      // TODO: send an email with userInfo.idToVerify
      sendVerificationEmail(email, userInfo.idToVerify, error => {
        if (error) {
          Toast.show({
            text: t('Error sending email! Try again or another email.'),
            duration: 3000,
            type: 'danger',
          })
          setUserInfo(null)
        }
      })
    } else {
      Toast.show({
        text: t("Error! That email didn't verify. Try again or another email."),
        duration: 3000,
        type: 'danger',
      })
    }
  }

  const verifyCode = async () => {
    setVerifying(true)
    if (code == userInfo.idToVerify) {
      Toast.show({
        text: t('Success!'),
        duration: 3000,
        type: 'success',
      })
      const [verified, newUserInfo] = await verifyUser(userInfo)
      if (verified) {
        // console.log('newUserInfo', newUserInfo)
        setUserInfo({ ...newUserInfo }) // create a new object to force a re-render
      } else {
        console.log('FAIL', newUserInfo)
        // newUserInfo is the license verification response
        let text = ''
        if (newUserInfo && newUserInfo.problem == 'no_activations_left' && !newUserInfo.hasActivationsLeft) {
          // not valid because of number of activations
          text = t('It looks like you have Plottr on the max number of devices already')
        } else {
          // invalid
          text = t('There was an error activating your license key on this device')
        }
        Toast.show({
          text: text,
          duration: 5000,
          type: 'danger',
        })
      }
    } else {
      Toast.show({
        text: t("Error! That code didn't verify. Try again."),
        duration: 3000,
        type: 'danger',
      })
    }
    setVerifying(false)
  }

  const renderEnterEmail = () => {
    return (
      <Container>
        <Content style={styles.content}>
          <H1 style={styles.header}>{t('Welcome to Plottr!')}</H1>
          <H2 style={styles.header}>{t("Let's verify your license")}</H2>
          <Form style={styles.form}>
            <Item inlineLabel last regular style={styles.label}>
              <Label>{t('Email')}</Label>
              <Input
                key='email'
                onChangeText={text => setEmail(text)}
                autoCapitalize='none'
                autoCompleteType='email'
                keyboardType='email-address'
              />
            </Item>
            <Button block primary onPress={verifyLicense}>
              <Text>{t('Check')}</Text>
              {verifying ? <Spinner color='white' /> : null}
            </Button>
          </Form>
          <Text>{t('This will send you an email with a code')}</Text>
          <View style={styles.centeredTextWrapper}>
            <Text style={styles.centeredText}>{t("Don't have a license? Go to our website to learn more")}</Text>
            <Button transparent large onPress={() => Linking.openURL('https://getplottr.com')} style={styles.ourWebsiteButton}>
              <Text>{t('getplottr.com')}</Text>
            </Button>
          </View>
        </Content>
      </Container>
    )
  }

  const renderVerification = () => {
    return (
      <Container>
        <Content style={styles.content}>
          <H1 style={styles.header}>{t('Welcome to Plottr!')}</H1>
          <H2 style={styles.header}>{t('Enter your verification code to activate this device')}</H2>
          <Form style={styles.form}>
            <Item inlineLabel last regular style={styles.label}>
              <Label>{t('Code')}</Label>
              <Input
                key='code'
                onChangeText={text => setCode(text)}
                autoCapitalize='none'
                autoCompleteType='off'
                keyboardType='number-pad'
              />
            </Item>
            <Button block success onPress={verifyCode}>
              <Text>{t('Verify')}</Text>
              {verifying ? <Spinner color='white' /> : null}
            </Button>
          </Form>
          <Text>{t('You should have received an email with a code')}</Text>
          <View style={styles.centeredTextWrapper}>
            <Text style={styles.centeredText}>{t('Verifying with email: {email}', {email: userInfo.email})}</Text>
            <Button transparent large onPress={() => setUserInfo(null)} style={styles.ourWebsiteButton} >
              <Text>{t('Use a different email')}</Text>
            </Button>
          </View>
        </Content>
      </Container>
    )
  }

  // no userInfo -> enter email
  // userInfo but not verified -> verification
  // verified -> Main
  const renderBody = () => {
    if (!userInfo) {
      return renderEnterEmail()
    }

    if (userInfo && !userInfo.verified) {
      return renderVerification()
    }

    if (userInfo && userInfo.verified) {
      return <Main v2={userInfo.isV2} logout={logout} />
    }
  }

  return (
    <SafeAreaProvider>
      <Root>
        <StatusBar barStyle='dark-content' />
        <AppErrorBoundary reset={resetOnError} recover={recoverFromError}>
          { renderBody() }
        </AppErrorBoundary>
      </Root>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  content: {
    padding: 16,
  },
  header: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    marginBottom: 16,
  },
  form: {
    marginVertical: 16,
  },
  centeredTextWrapper: {
    marginTop: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ourWebsiteButton: {
    alignSelf: 'center',
  },
  centeredText: {
    fontSize: 20,
  },
})

export default App
