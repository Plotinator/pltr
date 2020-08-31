import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import NotesList from './NotesList'

export default function NotesHome (props) {
  return <SafeAreaView style={{flex: 1}}>
    <ErrorBoundary>
      <NotesList navigation={props.navigation}/>
    </ErrorBoundary>
  </SafeAreaView>
}