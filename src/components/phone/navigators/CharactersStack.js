import React from 'react'
import i18n from 'format-message'
import { createStackNavigator } from '@react-navigation/stack'
import CharactersHome from '../characters/CharactersHome'
import AddButton from '../../ui/AddButton'
import CharacterDetails from '../characters/CharacterDetails'

const Stack = createStackNavigator()

export default function CharactersStack (props) {
  const addCharacter = () => {
    props.navigation.push('CharacterDetails', {isNewCharacter: true})
  }

  return <Stack.Navigator>
    <Stack.Screen name='CharactersHome' component={CharactersHome}
      options={{
        title: i18n('Characters'),
        headerRight: () => <AddButton onPress={addCharacter} />
      }}
    />
    <Stack.Screen name='CharacterDetails' component={CharacterDetails} />
  </Stack.Navigator>
}