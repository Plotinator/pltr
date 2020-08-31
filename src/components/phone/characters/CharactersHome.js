import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import CharactersList from './CharactersList'

export default function CharactersHome (props) {
  return <SafeAreaView style={{flex: 1}}>
    <ErrorBoundary>
      <CharactersList navigation={props.navigation}/>
    </ErrorBoundary>
  </SafeAreaView>
}