import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import PlacesList from './PlacesList'

export default function PlacesHome (props) {
  //gray-9
  return <SafeAreaView style={{flex: 1, backgroundColor: 'hsl(210, 36%, 96%)'}}>
    <ErrorBoundary>
      <PlacesList navigation={props.navigation}/>
    </ErrorBoundary>
  </SafeAreaView>
}