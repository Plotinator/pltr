/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react'
import { StyleSheet, View, StatusBar, NativeModules, NativeEventEmitter } from 'react-native'
import { Container, Content, Text, H1, H2, Form, Item, Input, Button, Label, Spinner } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import AsyncStorage from '@react-native-community/async-storage'
import { checkForActiveLicense, getUser } from './src/utils/user_info'
import { EDD_KEY } from 'react-native-dotenv'

const DocumentEvents = new NativeEventEmitter(NativeModules.ReactNativeEventEmitter)
DocumentEvents.addListener('onOpenDocument', data => {
  NativeModules.DocumentBrowser.closeBrowser()
  console.log('onOpenDocument', data)
  const filePath = data.documentURL
  const json = data.data
  if (json.newFile) {
    // creating a new file
  } else {
  }
})

const App = () => {
  // setTimeout(() => NativeModules.DocumentBrowser.openBrowser(), 1000)
  const [userInfo, setUserInfo] = useState(null)
  const [email, setEmail] = useState('')
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    let ignore = false

    async function fetchUserInfo() {
      const info = await getUser()
      console.log('user info', info)
      if (!ignore) setUserInfo(info)
    }

    fetchUserInfo(ignore)
    return () => {
      ignore = true
    }
  }, [])

  const verifyLicense = async () => {
    setVerifying(true)
    const userInfo = await checkForActiveLicense(email)
    console.log(userInfo)
  }

  return (
    <>
      <StatusBar barStyle='dark-content' />
      <Container>
        <Content style={styles.content}>
          <H1 style={styles.header}>Welcome to Plottr!</H1>
          <H2 style={styles.header}>Let's verify your license</H2>
          <Form style={styles.form}>
            <Item inlineLabel last regular style={styles.label}>
              <Label>Email</Label>
              <Input
                onChangeText={text => setEmail(text)}
                autoCapitalize='none'
                autoCompleteType='email'
                keyboardType='email-address'
              />
            </Item>
            <Button block success onPress={verifyLicense}>
              <Text onPress={verifyLicense}>Verify</Text>
              {verifying ? <Spinner color='orange' /> : null}
            </Button>
          </Form>
          <Text>This will send you an email with a code</Text>
        </Content>
      </Container>
    </>
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
