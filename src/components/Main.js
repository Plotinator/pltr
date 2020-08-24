/**
 * @format
 */

import React, { useEffect, useState } from 'react'
import { StyleSheet, View, NativeModules, NativeEventEmitter } from 'react-native'
import { Container, Content, Text, H1, H2, Form, Item, Input, Button, Label, Spinner } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'

const DocumentEvents = new NativeEventEmitter(NativeModules.ReactNativeEventEmitter)

const Main = () => {
  const [document, setDocument] = useState(null)

  useEffect(() => {
    if (!document) NativeModules.DocumentBrowser.openBrowser()

    DocumentEvents.addListener('onOpenDocument', data => {
      NativeModules.DocumentBrowser.closeBrowser()
      console.log('onOpenDocument', data)
      const filePath = data.documentURL
      const json = data.data
      if (json.newFile) {
        // creating a new file
      } else {
        // opening old file
      }
    })

    return () => DocumentEvents.removeAllListeners('onOpenDocument')
  }, [])

  return <Text>Dude</Text>
}

export default Main
