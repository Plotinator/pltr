import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import TagsList from './TagsList'

export default function TagsHome (props) {
  return <SafeAreaView style={{flex: 1}}>
    <ErrorBoundary>
      <TagsList navigation={props.navigation}/>
    </ErrorBoundary>
  </SafeAreaView>
}