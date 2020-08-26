import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import { Text } from 'native-base'

export default function NotesHome (props) {
  return <SafeAreaView>
    <ErrorBoundary>
      <Text>Notes</Text>
    </ErrorBoundary>
  </SafeAreaView>
}