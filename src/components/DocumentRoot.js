import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Container } from 'native-base'
import { isTablet } from 'react-native-device-info'
import { newFileState, actions } from 'pltr/v2'
import { getStore } from '../store/configureStore'
import APP_VERSION from '../../version'
import RootPhoneNavigator from './phone/navigators/RootPhoneNavigator'
import RootTabletNavigator from './tablet/navigators/RootTabletNavigator'

export default function DocumentRoot (props) {

  useEffect(() => {
    loadDocument()
  }, [props.document])

  const loadDocument = () => {
    const store = getStore()
    const { document } = props
    const filePath = document.documentURL
    const json = JSON.parse(document.data)
    if (json.newFile) {
      // creating a new file
      const name = json.storyName.replace('.pltr', '')
      const newFile = newFileState(name, APP_VERSION)
      store.dispatch(actions.uiActions.loadFile(filePath, false, newFile, APP_VERSION))
    } else {
      // opening existing file
      store.dispatch(actions.uiActions.loadFile(filePath, false, json, json.file.version))
    }
  }

  const renderByDevice = () => {
    if (isTablet()) return renderTablet()

    return renderPhone()
  }

  const renderPhone = () => {
    return <RootPhoneNavigator />
  }

  const renderTablet = () => {
    return <RootTabletNavigator />
  }

  return <NavigationContainer>
    { renderByDevice() }
  </NavigationContainer>
}