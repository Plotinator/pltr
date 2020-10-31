import React, { useEffect, useState } from 'react'
import { NativeModules, NativeEventEmitter, Platform, StyleSheet, Image } from 'react-native'
import { Provider } from 'react-redux'
import { Content, Spinner, Container, H1, H3, Form, Button, Text, Thumbnail } from 'native-base'
import DocumentRoot from './DocumentRoot'
import { configureStore } from '../store/configureStore'
import MainErrorBoundary from './MainErrorBoundary'
import t from 'format-message'
import { isTablet } from 'react-native-device-info'
import images from '../images'
const { DocumentViewController, ReactNativeEventEmitter, DocumentBrowser } = NativeModules

let DocumentEvents
if (Platform.OS == 'ios') {
  DocumentEvents = new NativeEventEmitter(ReactNativeEventEmitter)
} else if (Platform.OS == 'android') {
  DocumentEvents = new NativeEventEmitter(NativeModules.AndroidDocumentBrowser)
}
let storeV2 = configureStore({})

const Main = ({v2, logout}) => {
  const [document, setDocument] = useState(null)
  const [androidLoading, setLoading] = useState(false)

  const closeFile = () => {
    setDocument(null)
    storeV2 = configureStore({})
    if (Platform.OS == 'ios') {
      DocumentViewController.closeDocument()
    }
  }

  useEffect(() => {
    if (!document) {
      if (Platform.OS == 'ios') {
        DocumentBrowser.openBrowser()
      }
      DocumentEvents.addListener('onOpenDocument', data => {
        if (Platform.OS == 'ios') {
          DocumentBrowser.closeBrowser()
          if (isTablet()) {
            setTimeout(() => setDocument(data), 600)
          } else {
            setDocument(data)
          }
        } else if (Platform.OS == 'android') {
          setDocument(data)
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
          <DocumentRoot document={document} closeFile={closeFile} logout={logout} />
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
            <Image source={images.logo} style={styles.image}/>
            <H1 style={styles.header}>{t('Welcome to Plottr!')}</H1>
            <Form style={styles.form}>
              <Button rounded onPress={openDoc} style={styles.button}>
                <Text>{t('Open')}</Text>
              </Button>
              <Text note style={styles.centeredText}>{t('Open an Existing Plottr File')}</Text>
              <Button rounded onPress={createDoc} style={styles.button}>
                <Text>{t('Create New')}</Text>
              </Button>
              <Text note style={styles.centeredText}>{t('Create a New Plottr File')}</Text>
            </Form>
          </Content>
        </Container>
      )
    }
  }

  if (v2) return renderV2()

  return renderV1()
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    backgroundColor: 'hsl(210, 36%, 96%)', //gray-9
  },
  image: {
    marginTop: 20,
    height: 100,
    width: 300,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  header: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  form: {
    marginVertical: 16,
  },
  button: {
    marginVertical: 16,
    backgroundColor: '#FF7F32',
    alignSelf: 'center',
    width: 250,
    justifyContent: 'center',
  },
  centeredText: {
    textAlign: 'center',
    color: 'hsl(209, 28%, 39%)', //gray-3
  },
})

export default Main
