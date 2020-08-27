import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import i18n from 'format-message'
import OutlineHome from '../outline/OutlineHome'
import SceneDetails from '../outline/SceneDetails'
import { Button, Icon } from 'native-base'
import { getStore } from '../../../store/configureStore'
import { actions } from 'pltr/v2'
import AddButton from '../../ui/AddButton'

const Stack = createStackNavigator()

export default function OutlineStack (props) {

  const addChapter = () => {
    const store = getStore()
    const state = store.getState()
    const currentTimeline = state.ui.currentTimeline

    // TODO: rename scene to chapter
    store.dispatch(actions.sceneActions.addScene(currentTimeline))
  }

  return <Stack.Navigator>
    <Stack.Screen name='OutlineHome' component={OutlineHome}
      options={{
        title: i18n('Outline'),
        headerRight: () => <AddButton onPress={addChapter} />
      }}
    />
    <Stack.Screen name='SceneDetails' component={SceneDetails} options={{ title: i18n('Scene Details') }}/>
  </Stack.Navigator>
}