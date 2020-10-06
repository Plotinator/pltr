/**
 * @format
 */

import React, { useEffect, useState } from 'react'
import { NativeModules, NativeEventEmitter, Platform } from 'react-native'
import { Provider } from 'react-redux'
import { Content, Spinner, Container } from 'native-base'
import DocumentRoot from './DocumentRoot'
import { configureStore } from '../store/configureStore'
import MainErrorBoundary from './MainErrorBoundary'
const { DocumentViewController, Document, ReactNativeEventEmitter, DocumentBrowser } = NativeModules

const DocumentEvents = new NativeEventEmitter(ReactNativeEventEmitter)
const storeV2 = configureStore({})

const Main = props => {
  const [document, setDocument] = useState(null)

  const closeFile = () => {
    setDocument(null)
    setTimeout(() => {
      if (Platform.OS === 'ios') {
        DocumentViewController.closeDocument()
        DocumentBrowser.openBrowser()
      } else if (Platform.OS === 'android') {
        Document.closeDocument()
      }
    }, 500)
  }

  useEffect(() => {
    if (!document) DocumentBrowser.openBrowser()

    DocumentEvents.addListener('onOpenDocument', data => {
      DocumentBrowser.closeBrowser()
      setDocument(data)
    })

    return () => DocumentEvents.removeAllListeners('onOpenDocument')
  }, [document])

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
    return (
      <Container>
        <Content>
          <Spinner color='orange' />
        </Content>
      </Container>
    )
  }

  if (props.v2) return renderV2()

  return renderV1()
}

export default Main
