import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import i18n from 'format-message'
import AddButton from '../../ui/AddButton'
import DrawerButton from '../../ui/DrawerButton'
import TagsHome from '../tags/TagsHome'
import TagDetails from '../tags/TagDetails'

const Stack = createStackNavigator()

export default function TagsStack (props) {
  const addTag = () => {
    props.navigation.push('TagDetails', {isNewTag: true})
  }

  return <Stack.Navigator>
    <Stack.Screen name='NotesHome' component={TagsHome}
      options={{
        title: i18n('Tags'),
        headerRight: () => <AddButton onPress={addTag} />,
        headerLeft: () => <DrawerButton navigation={props.navigation} />,
      }}
    />
    <Stack.Screen name='TagDetails' component={TagDetails} />
  </Stack.Navigator>
}