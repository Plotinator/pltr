import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import PlacesList from './PlacesList'

export default function PlacesHome (props) {
  return <SafeAreaView style={{flex: 1}}>
    <ErrorBoundary>
      <PlacesList navigation={props.navigation}/>
    </ErrorBoundary>
  </SafeAreaView>
}