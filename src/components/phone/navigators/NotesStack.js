import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import i18n from 'format-message'
import NotesHome from '../notes/NotesHome'
import NoteDetails from '../notes/NoteDetails'
import AddButton from '../../ui/AddButton'

const Stack = createStackNavigator()

export default function NotesStack (props) {
  const addNote = () => {
    props.navigation.push('NoteDetails', {isNewNote: true})
  }

  return <Stack.Navigator>
    <Stack.Screen name='NotesHome' component={NotesHome}
      options={{
        title: i18n('Notes'),
        headerRight: () => <AddButton onPress={addNote} />
      }}
    />
    <Stack.Screen name='NoteDetails' component={NoteDetails} />
  </Stack.Navigator>
}