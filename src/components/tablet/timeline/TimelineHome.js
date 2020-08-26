import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import { Text } from 'native-base'

export default function TimelineHome (props) {
  return <SafeAreaView>
    <ErrorBoundary>
      <Text>Timeline</Text>
    </ErrorBoundary>
  </SafeAreaView>
}