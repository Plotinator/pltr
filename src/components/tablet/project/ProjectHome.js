import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import Project from './Project'

export default function ProjectHome (props) {
  console.log('PROJECT HOME', props)
  //gray-9
  return <SafeAreaView style={{flex: 1, backgroundColor: 'hsl(210, 36%, 96%)'}}>
    <ErrorBoundary>
      <Project navigation={props.navigation} closeFile={props.navigation?.route?.params?.closeFile}/>
    </ErrorBoundary>
  </SafeAreaView>
}