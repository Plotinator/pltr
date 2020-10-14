/**
 * @format
 */

import React, { useEffect, useState } from 'react'
import { NativeModules, NativeEventEmitter, Platform, StyleSheet } from 'react-native'
import { Provider } from 'react-redux'
import { Content, Spinner, Container, H1, H2, Form, Button, Text } from 'native-base'
import DocumentRoot from './DocumentRoot'
import { configureStore } from '../store/configureStore'
import MainErrorBoundary from './MainErrorBoundary'
import t from 'format-message'
const { DocumentViewController, ReactNativeEventEmitter, DocumentBrowser } = NativeModules

let DocumentEvents
if (Platform.OS == 'ios') {
  DocumentEvents = new NativeEventEmitter(ReactNativeEventEmitter)
} else if (Platform.OS == 'android') {
  DocumentEvents = new NativeEventEmitter(NativeModules.AndroidDocumentBrowser)
}
let storeV2 = configureStore({})

const Main = props => {
  const [document, setDocument] = useState(null)
  const [androidLoading, setLoading] = useState(false)

  const closeFile = () => {
    setDocument(null)
    storeV2 = configureStore({})
    if (Platform.OS == 'ios') {
      setTimeout(() => {
        DocumentViewController.closeDocument()
      }, 500)
    }
  }

  useEffect(() => {
    if (!document) {
      if (Platform.OS == 'ios') {
        DocumentBrowser.openBrowser()
      }
      DocumentEvents.addListener('onOpenDocument', data => {
        setDocument(data)
        if (Platform.OS == 'ios') {
          DocumentBrowser.closeBrowser()
        } else if (Platform.OS == 'android') {
          setLoading(false)
        }
      })
    }
  }, [document])

  const openDoc = () => {
    if (Platform.OS == 'android') {
      try {
        NativeModules.AndroidDocumentBrowser.openBrowser('open')
        setLoading(true)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const createDoc = () => {
    if (Platform.OS == 'android') {
      try {
        NativeModules.AndroidDocumentBrowser.openBrowser('create')
        setLoading(true)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const recoverFromError = () => {
    setDocument(null)
  }

  const renderV1 = () => {
    // TODO: figure out v1
    return null
  }

  const renderV2 = () => {
    return (
      <Provider store={storeV2} key={document?.documentURL}>
        <MainErrorBoundary recover={recoverFromError}>
          <DocumentRoot document={document} closeFile={closeFile} />
        </MainErrorBoundary>
      </Provider>
    )
  }

  if (!document) {
    if (Platform.OS == 'ios' || androidLoading) {
      return (
        <Container>
          <Content>
            <Spinner color='orange' />
          </Content>
        </Container>
      )
    } else if (Platform.OS == 'android') {
      return (
        <Container>
          <Content style={styles.content}>
            <H1 style={styles.header}>{t('Welcome to Plottr!')}</H1>
            <H2 style={styles.header}>{t('What would you like to do?')}</H2>
            <Form style={styles.form}>
              <Button block onPress={openDoc} style={styles.button}>
                <Text>{t('Open a Plottr Document')}</Text>
              </Button>
              <Button block onPress={createDoc} style={styles.button}>
                <Text>{t('Create a New Plottr Document')}</Text>
              </Button>
            </Form>
          </Content>
        </Container>
      )
    }
  }

  if (props.v2) return renderV2()

  return renderV1()
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  header: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  form: {
    marginVertical: 16,
  },
  button: {
    marginVertical: 16,
  },
})

export default Main
