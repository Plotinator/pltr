import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import { Text } from 'native-base'

export default function OutlineHome (props) {
  return <SafeAreaView>
    <ErrorBoundary>
      <Text>Outline</Text>
    </ErrorBoundary>
  </SafeAreaView>
}