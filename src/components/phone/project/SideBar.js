import React from 'react'
import { H3, View, Text, Button, Icon } from 'native-base'
import { SafeAreaView, StyleSheet, Linking } from 'react-native'
import { getVersion } from 'react-native-device-info'
import t from 'format-message'

export default function SideBar (props) {
  const goToDocs = () => {
    Linking.openURL('https://getplottr.com/docs')
  }

  const goToHelp = () => {
    Linking.openURL('https://getplottr.com/support')
  }

  //gray-9
  return <View style={{flex: 1, backgroundColor: 'hsl(210, 36%, 96%)'}}>
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.wrapper}>
        <H3>{t('Plottr')}</H3>
        <View>
          <Text>[Logo Here]</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <Button iconLeft info style={styles.button} onPress={props.closeFile}><Icon type='FontAwesome5' name='times-circle'/><Text>{t('Close File')}</Text></Button>
          <Button iconLeft info style={styles.button} onPress={goToDocs}><Icon type='FontAwesome5' name='book-open'/><Text>{t('Documentation')}</Text></Button>
          <Button iconLeft info style={styles.button} onPress={goToHelp}><Icon type='FontAwesome5' name='life-ring'/><Text>{t('Help')}</Text></Button>
        </View>
        <View style={styles.versionWrapper}>
          <Text note>{`App Version: ${getVersion()}`}</Text>
        </View>
      </View>
    </SafeAreaView>
  </View>
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  buttonWrapper: {
    padding: 16,
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
  },
  button: {
    marginVertical: 16,
  },
  versionWrapper: {
    marginTop: 'auto',
  },
  white: {
    color: 'white',
  },
})