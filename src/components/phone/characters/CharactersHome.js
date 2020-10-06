import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../shared/ErrorBoundary'
import CharactersList from './CharactersList'

export default function CharactersHome (props) {
  //gray-9
  return <SafeAreaView style={{flex: 1, backgroundColor: 'hsl(210, 36%, 96%)'}}>
    <ErrorBoundary>
      <CharactersList navigation={props.navigation}/>
    </ErrorBoundary>
  </SafeAreaView>
}