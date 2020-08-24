/**
 * @format
 */

import React, { useEffect, useState } from 'react'
import { StyleSheet, View, StatusBar } from 'react-native'
import { Container, Content, Text, H1, H2, Form, Item, Input, Button, Label, Spinner, Toast, Root } from 'native-base'
import { checkForActiveLicense, getUserVerification, verifyUser, reset } from '../utils/user_info'
import Main from './Main'

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
      if (!ignore) setUserInfo(fetchedInfo)
    }

    fetchUserInfo()
    return () => (ignore = true)
  }, [])

  const verifyLicense = async () => {
    setVerifying(true)
    const userInfo = await checkForActiveLicense(email)
    setVerifying(false)
    if (userInfo) {
      Toast.show({
        text: 'Success!',
        duration: 3000,
        type: 'success',
      })
      setUserInfo(userInfo)

      // TODO: send an email with userInfo.idToVerify
    } else {
      // TODO: show an error about failing to verify and try again or another email address
    }
  }

  const verifyCode = () => {
    setVerifying(true)
    if (code == userInfo.idToVerify) {
      Toast.show({
        text: 'Success!',
        duration: 3000,
        type: 'success',
      })
      const newUserInfo = verifyUser(userInfo)
      console.log('newUserInfo', newUserInfo)
      setUserInfo({ ...newUserInfo })
    } else {
      // TODO: show an error about trying again
    }
    setVerifying(false)
  }

  const renderEnterEmail = () => {
    return (
      <Container>
        <Content style={styles.content}>
          <H1 style={styles.header}>Welcome to Plottr!</H1>
          <H2 style={styles.header}>Let's verify your license</H2>
          <Form style={styles.form}>
            <Item inlineLabel last regular style={styles.label}>
              <Label>Email</Label>
              <Input
                key='email'
                onChangeText={text => setEmail(text)}
                autoCapitalize='none'
                autoCompleteType='email'
                keyboardType='email-address'
              />
            </Item>
            <Button block primary onPress={verifyLicense}>
              <Text>Check</Text>
              {verifying ? <Spinner color='white' /> : null}
            </Button>
          </Form>
          <Text>This will send you an email with a code</Text>
        </Content>
      </Container>
    )
  }

  const renderVerification = () => {
    return (
      <Container>
        <Content style={styles.content}>
          <H1 style={styles.header}>Welcome to Plottr!</H1>
          <H2 style={styles.header}>Enter your verification code</H2>
          <Form style={styles.form}>
            <Item inlineLabel last regular style={styles.label}>
              <Label>Code</Label>
              <Input
                key='code'
                onChangeText={text => setCode(text)}
                autoCapitalize='none'
                autoCompleteType='off'
                keyboardType='number-pad'
              />
            </Item>
            <Button block success onPress={verifyCode}>
              <Text>Verify</Text>
              {verifying ? <Spinner color='white' /> : null}
            </Button>
          </Form>
          <Text>You should have received an email with a code</Text>
        </Content>
      </Container>
    )
  }

  // no userInfo -> enter email
  // userInfo but not verified -> verification
  // verified -> the app
  const renderBody = () => {
    if (!userInfo) {
      return renderEnterEmail()
    }

    if (userInfo && !userInfo.verified) {
      return renderVerification()
    }

    console.log('renderBody', userInfo)
    if (userInfo && userInfo.verified) {
      return <Main />
    }
  }

  return (
    <Root>
      <StatusBar barStyle='dark-content' />
      {renderBody()}
    </Root>
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
})

export default App
