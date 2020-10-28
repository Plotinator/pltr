import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Container } from 'native-base'
import { isTablet } from 'react-native-device-info'
import { newFileState, actions, migrateIfNeeded } from 'pltr/v2'
import { getStore } from '../store/configureStore'
import RootPhoneNavigator from './phone/navigators/RootPhoneNavigator'
import RootTabletNavigator from './tablet/navigators/RootTabletNavigator'
import { FILE_VERSION } from '../utils/constants'

export default function DocumentRoot (props) {

  useEffect(() => {
    loadDocument()
  }, [props.document])

  const loadDocument = () => {
    const store = getStore()
    const { document } = props
    if (document) {
      const filePath = document.documentURL
      // console.log('PATH', filePath)
      const json = JSON.parse(document.data)
      if (json.newFile) {
        // creating a new file
        let name = ''
        if (json.storyName) name = json.storyName // ios
        if (document.storyName) name = document.storyName // android
        name = name.replace('.pltr', '')
        const newFile = newFileState(name, FILE_VERSION)
        store.dispatch(actions.uiActions.loadFile(filePath, false, newFile, FILE_VERSION))
      } else {
        // opening existing file
        migrateIfNeeded(FILE_VERSION, json, filePath, null, (err, migrated, resultJson) => { // TODO: backup somehow?
          if (err) console.error(err)
          store.dispatch(actions.uiActions.loadFile(filePath, migrated, resultJson, resultJson.file.version))
        })
      }
    }
  }

  const renderByDevice = () => {
    if (isTablet()) return renderTablet()

    return renderPhone()
  }

  const renderPhone = () => {
    return <RootPhoneNavigator closeFile={props.closeFile} logout={props.logout} />
  }

  const renderTablet = () => {
    return <RootTabletNavigator closeFile={props.closeFile} logout={props.logout} />
  }

  return <NavigationContainer>
    { renderByDevice() }
  </NavigationContainer>
}