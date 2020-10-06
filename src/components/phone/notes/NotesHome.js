import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../shared/ErrorBoundary'
import NotesList from './NotesList'

export default function NotesHome (props) {
  //gray-9
  return <SafeAreaView style={{flex: 1, backgroundColor: 'hsl(210, 36%, 96%)'}}>
    <ErrorBoundary>
      <NotesList navigation={props.navigation}/>
    </ErrorBoundary>
  </SafeAreaView>
}