import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import t from 'format-message'
import NotesHome from '../notes/NotesHome'
import NoteDetails from '../notes/NoteDetails'
import AddButton from '../../ui/AddButton'
import DrawerButton from '../../ui/DrawerButton'
import withBoundary from '../shared/BoundaryWrapper'

const Stack = createStackNavigator()
const NoteDetailsBounded = withBoundary(NoteDetails)

export default function NotesStack (props) {
  const addNote = () => {
    props.navigation.push('NoteDetails', {isNewNote: true})
  }

  return <Stack.Navigator>
    <Stack.Screen name='NotesHome' component={NotesHome}
      options={{
        title: t('Notes'),
        headerRight: () => <AddButton onPress={addNote} />,
        headerLeft: () => <DrawerButton openDrawer={props.route?.params?.openDrawer} />,
      }}
    />
    <Stack.Screen name='NoteDetails' component={NoteDetailsBounded} options={{title: t('Note Details')}} />
  </Stack.Navigator>
}