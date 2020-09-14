import React from 'react'
import { SafeAreaView } from 'react-native'
import ErrorBoundary from '../../ErrorBoundary'
import TimelineWrapper from './TimelineWrapper'

export default function TimelineHome (props) {
  //gray-9
  return <SafeAreaView style={{flex: 1, backgroundColor: 'hsl(210, 36%, 96%)'}}>
    <ErrorBoundary>
      <TimelineWrapper navigation={props.navigation}/>
    </ErrorBoundary>
  </SafeAreaView>
}