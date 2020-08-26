/**
 * @format
 */

import React, { useEffect, useState } from 'react'
import { StyleSheet, View, NativeModules, NativeEventEmitter } from 'react-native'
import { Provider } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Content, Spinner, Container } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import DocumentRoot from './DocumentRoot'
import { configureStore } from '../store/configureStore'

const DocumentEvents = new NativeEventEmitter(NativeModules.ReactNativeEventEmitter)

const Main = props => {
  const [document, setDocument] = useState(null)

  useEffect(() => {
    if (!document) NativeModules.DocumentBrowser.openBrowser()

    DocumentEvents.addListener('onOpenDocument', data => {
      NativeModules.DocumentBrowser.closeBrowser()
      console.log('onOpenDocument', data)
      setDocument(data)
    })

    return () => DocumentEvents.removeAllListeners('onOpenDocument')
  }, [])

  const renderV1 = () => {
    // TODO: figure out v1
    return null
  }

  const renderV2 = () => {
    const store = configureStore({})
    return (
      <Provider store={store}>
        <DocumentRoot document={document} />
      </Provider>
    )
  }

  const renderMain = () => {
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

  return renderMain()
}

export default Main
