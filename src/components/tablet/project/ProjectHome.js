import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import { Text } from 'native-base'

export default function ProjectHome (props) {
  return <SafeAreaView>
    <ErrorBoundary>
      <Text>Project</Text>
    </ErrorBoundary>
  </SafeAreaView>
}