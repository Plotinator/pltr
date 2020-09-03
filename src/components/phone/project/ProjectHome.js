import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import Project from './Project'

export default function ProjectHome (props) {
  return <SafeAreaView style={{flex: 1}}>
    <ErrorBoundary>
      <Project navigation={props.navigation}/>
    </ErrorBoundary>
  </SafeAreaView>
}