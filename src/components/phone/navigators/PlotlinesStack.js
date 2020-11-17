import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import t from 'format-message'
import PlotlinesScreen from '../plotlines/PlotlinesScreen'
import PlotlineDetails from '../plotlines/PlotlineDetails'
import withBoundary from '../shared/BoundaryWrapper'

const Stack = createStackNavigator()
const PlotlineDetailsBounded = withBoundary(PlotlineDetails)

export default function PlotlinesStack (props) {
  return <Stack.Navigator>
    <Stack.Screen name='PlotlinesHome' component={PlotlinesScreen} options={{ title: t('Plotlines'), headerBackTitle: t('Done') }}/>
    <Stack.Screen name='PlotlineDetails' component={PlotlineDetailsBounded} options={{ title: t('Plotline Details'), headerBackTitle: t('Back') }} />
  </Stack.Navigator>
}