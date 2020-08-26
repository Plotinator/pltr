import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import { Text } from 'native-base'

export default function CharactersHome (props) {
  return <SafeAreaView>
    <ErrorBoundary>
      <Text>Characters</Text>
    </ErrorBoundary>
  </SafeAreaView>
}