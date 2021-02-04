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
import withBoundary from '../shared/BoundaryWrapper'
import { Text } from '../../shared/common'

const Stack = createStackNavigator()
const SceneDetailsBounded = withBoundary(SceneDetails)
const SeriesDetailsBounded = withBoundary(SeriesDetails)

export default function OutlineStack(props) {
  const addChapter = () => {
    const store = getStore()
    const state = store.getState()
    const currentTimeline = state.ui.currentTimeline

    // TODO: rename scene to chapter
    store.dispatch(actions.sceneActions.addScene(currentTimeline))
  }

  const addBook = () => {
    props.navigation.push('SeriesDetails', { isNewBook: true })
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='ProjectHome'
        component={ProjectHome}
        options={{
          title: (
            <Text fontStyle={'bold'} color={null}>
              {t('Project')}
            </Text>
          ),
          headerLeft: () => (
            <DrawerButton openDrawer={props.route?.params?.openDrawer} />
          )
        }}
      />
      <Stack.Screen name='SeriesDetails' component={SeriesDetailsBounded} />
      <Stack.Screen
        name='OutlineHome'
        component={OutlineHome}
        options={{
          title: (
            <Text fontStyle={'bold'} color={null}>
              {t('Outline')}
            </Text>
          ),
          headerRight: () => <AddButton onPress={addChapter} />
        }}
      />
      <Stack.Screen
        name='SceneDetails'
        component={SceneDetailsBounded}
        options={{
          title: (
            <Text fontStyle={'bold'} color={null}>
              {t('Scene Details')}
            </Text>
          )
        }}
      />
    </Stack.Navigator>
  )
}
