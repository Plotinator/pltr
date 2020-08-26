import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import { Text } from 'native-base'

export default function TagsHome (props) {
  return <SafeAreaView>
    <ErrorBoundary>
      <Text>Tags</Text>
    </ErrorBoundary>
  </SafeAreaView>
}