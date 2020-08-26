import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import { Text } from 'native-base'

export default function PlacesHome (props) {
  return <SafeAreaView>
    <ErrorBoundary>
      <Text>Places</Text>
    </ErrorBoundary>
  </SafeAreaView>
}