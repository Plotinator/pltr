import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import t from 'format-message'
import OutlineHome from '../outline/OutlineHome'
import ProjectHome from '../project/ProjectHome'
import SceneDetails from '../outline/SceneDetails'
import { getStore } from '../../../store/configureStore'
import { actions } from 'pltr/v2'
import AddButton from '../../ui/AddButton'
import DrawerButton from '../../ui/DrawerButton'
import SeriesDetails from '../project/SeriesDetails'

const Stack = createStackNavigator()

export default function OutlineStack (props) {

  const addChapter = () => {
    const store = getStore()
    const state = store.getState()
    const currentTimeline = state.ui.currentTimeline

    // TODO: rename scene to chapter
    store.dispatch(actions.sceneActions.addScene(currentTimeline))
  }

  const addBook = () => {
    props.navigation.push('SeriesDetails', {isNewBook: true})
  }

  return <Stack.Navigator>
    <Stack.Screen name='ProjectHome' component={ProjectHome}
      options={{
        title: t('Project'),
        headerRight: () => <AddButton onPress={addBook} />,
        headerLeft: () => <DrawerButton openDrawer={props.route?.params?.openDrawer} />,
      }}
    />
    <Stack.Screen name='SeriesDetails' component={SeriesDetails}/>
    <Stack.Screen name='OutlineHome' component={OutlineHome}
      options={{
        title: t('Outline'),
        headerRight: () => <AddButton onPress={addChapter} />,
      }}
    />
    <Stack.Screen name='SceneDetails' component={SceneDetails} options={{ title: t('Scene Details') }}/>
  </Stack.Navigator>
}