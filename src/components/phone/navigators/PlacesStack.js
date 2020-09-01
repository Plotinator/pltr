import React from 'react'
import i18n from 'format-message'
import { createStackNavigator } from '@react-navigation/stack'
import PlacesHome from '../places/PlacesHome'
import PlaceDetails from '../places/PlaceDetails'
import AddButton from '../../ui/AddButton'

const Stack = createStackNavigator()

export default function PlacesStack (props) {
  const addPlace = () => {
    props.navigation.push('PlaceDetails', {isNewPlace: true})
  }

  return <Stack.Navigator>
    <Stack.Screen name='PlacesHome' component={PlacesHome}
      options={{
        title: i18n('Places'),
        headerRight: () => <AddButton onPress={addPlace} />
      }}
    />
    <Stack.Screen name='PlaceDetails' component={PlaceDetails} />
  </Stack.Navigator>
}