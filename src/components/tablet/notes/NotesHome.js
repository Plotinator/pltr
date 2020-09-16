import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import Notes from './Notes'

export default function NotesHome (props) {
  //gray-9
  return <SafeAreaView style={{flex: 1, backgroundColor: 'hsl(210, 36%, 96%)'}}>
    <ErrorBoundary>
      <Notes navigation={props.navigation} />
    </ErrorBoundary>
  </SafeAreaView>
}