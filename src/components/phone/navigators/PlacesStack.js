import React from 'react'
import t from 'format-message'
import { createStackNavigator } from '@react-navigation/stack'
import PlacesHome from '../places/PlacesHome'
import PlaceDetails from '../places/PlaceDetails'
import AddButton from '../../ui/AddButton'
import DrawerButton from '../../ui/DrawerButton'

const Stack = createStackNavigator()

export default function PlacesStack (props) {
  const addPlace = () => {
    props.navigation.push('PlaceDetails', {isNewPlace: true})
  }

  return <Stack.Navigator>
    <Stack.Screen name='PlacesHome' component={PlacesHome}
      options={{
        title: t('Places'),
        headerRight: () => <AddButton onPress={addPlace} />,
        headerLeft: () => <DrawerButton openDrawer={props.route?.params?.openDrawer} />,
      }}
    />
    <Stack.Screen name='PlaceDetails' component={PlaceDetails} />
  </Stack.Navigator>
}