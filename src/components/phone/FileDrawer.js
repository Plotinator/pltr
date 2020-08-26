import React from 'react'
import { Drawer, Text } from 'native-base'
import { SafeAreaView } from 'react-native'

export default function FileDrawer (props) {
  return <SafeAreaView>
    <Drawer>
      <Text>Drawer</Text>
    </Drawer>
  </SafeAreaView>
}