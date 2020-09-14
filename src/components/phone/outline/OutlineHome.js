import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import Outline from './Outline'

export default function OutlineHome (props) {
  //gray-9
  return <SafeAreaView style={{flex: 1, backgroundColor: 'hsl(210, 36%, 96%)'}}>
    <ErrorBoundary>
      <Outline navigation={props.navigation}/>
    </ErrorBoundary>
  </SafeAreaView>
}