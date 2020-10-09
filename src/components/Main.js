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
const { DocumentViewController, ReactNativeEventEmitter, DocumentBrowser, AndroidDocumentBrowser } = NativeModules

const DocumentEvents = new NativeEventEmitter(ReactNativeEventEmitter)
const AndroidDocumentEvents = new NativeEventEmitter(AndroidDocumentBrowser)
const storeV2 = configureStore({})

const Main = props => {
  const [document, setDocument] = useState(null)
  const [androidLoading, setLoading] = useState(false)

  const closeFile = () => {
    setDocument(null)
    setTimeout(() => {
      if (Platform.OS === 'ios') {
        DocumentViewController.closeDocument()
        DocumentBrowser.openBrowser()
      }
    }, 500)
  }

  useEffect(() => {
    if (!document) {
      if (Platform.OS == 'ios') {
        DocumentBrowser.openBrowser()
      }
    }

    if (Platform.OS == 'ios') {
      DocumentEvents.addListener('onOpenDocument', data => {
        DocumentBrowser.closeBrowser()
        setDocument(data)
      })
      return () => DocumentEvents.removeAllListeners('onOpenDocument')
    } else if (Platform.OS == 'android') {
      AndroidDocumentEvents.addListener('onOpenDocument', data => {
        setDocument(data)
        setLoading(false)
      })
      return () => AndroidDocumentEvents.removeAllListeners('onOpenDocument')
    }
  }, [document])

  const openDoc = () => {
    if (Platform.OS == 'android') {
      try {
        AndroidDocumentBrowser.openBrowser('open')
        setLoading(true)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const createDoc = () => {
    if (Platform.OS == 'android') {
      try {
        AndroidDocumentBrowser.openBrowser('create')
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
      <Provider store={storeV2}>
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
