import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import Outline from './Outline'

export default function OutlineHome (props) {
  return <SafeAreaView style={{flex: 1}}>
    <ErrorBoundary>
      <Outline navigation={props.navigation}/>
    </ErrorBoundary>
  </SafeAreaView>
}