import React from 'react'
import t from 'format-message'
import { createStackNavigator } from '@react-navigation/stack'
import CharactersHome from '../characters/CharactersHome'
import AddButton from '../../ui/AddButton'
import CharacterDetails from '../characters/CharacterDetails'
import DrawerButton from '../../ui/DrawerButton'

const Stack = createStackNavigator()

export default function CharactersStack (props) {
  const addCharacter = () => {
    props.navigation.push('CharacterDetails', {isNewCharacter: true})
  }

  return <Stack.Navigator>
    <Stack.Screen name='CharactersHome' component={CharactersHome}
      options={{
        title: t('Characters'),
        headerRight: () => <AddButton onPress={addCharacter} />,
        headerLeft: () => <DrawerButton openDrawer={props.route?.params?.openDrawer} />,
      }}
    />
    <Stack.Screen name='CharacterDetails' component={CharacterDetails} options={{title: t('Details')}} />
  </Stack.Navigator>
}