import React from 'react'
import { H3, View, Text, Button, Icon, H1 } from 'native-base'
import { SafeAreaView, StyleSheet, Linking, Image } from 'react-native'
import { getVersion } from 'react-native-device-info'
import t from 'format-message'
import images from '../../../images'

export default function SideBar (props) {
  const goToDocs = () => {
    Linking.openURL('https://getplottr.com/docs')
  }

  const goToHelp = () => {
    Linking.openURL('https://getplottr.com/support')
  }

  const goToDemos = () => {
    Linking.openURL('https://getplottr.com/demos')
  }

  const goToVideos = () => {
    Linking.openURL('https://learn.getplottr.com/courses/plottr-101/')
  }

  //gray-9
  return <View style={{flex: 1, backgroundColor: 'hsl(210, 36%, 96%)'}}>
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.wrapper}>
        <H1>{t('Menu')}</H1>
        <View style={styles.buttonWrapper}>
          <Button iconLeft bordered style={styles.button} onPress={props.closeFile}><Icon type='FontAwesome5' name='times-circle' style={styles.icon}/><Text style={styles.text}>{t('Close File')}</Text></Button>
          <Button iconLeft bordered style={styles.button} onPress={goToDocs}><Icon type='FontAwesome5' name='book-open' style={styles.icon}/><Text style={styles.text}>{t('Documentation')}</Text></Button>
          <Button iconLeft bordered style={styles.button} onPress={goToHelp}><Icon type='FontAwesome5' name='life-ring' style={styles.icon}/><Text style={styles.text}>{t('Help')}</Text></Button>
          <Button iconLeft bordered style={styles.button} onPress={goToVideos}><Icon type='FontAwesome5' name='video' style={styles.icon}/><Text style={styles.text}>{t('Learn')}</Text></Button>
          <Button iconLeft bordered style={styles.button} onPress={goToDemos}><Icon type='FontAwesome5' name='file-alt' style={styles.icon}/><Text style={styles.text}>{t('Demos')}</Text></Button>
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
    backgroundColor: 'white',
    borderColor: 'hsl(211, 27%, 70%)', //gray-6
  },
  text: {
    color: 'hsl(209, 61%, 16%)', //gray-0
  },
  icon: {
    color: 'hsl(209, 61%, 16%)', //gray-0
  },
  versionWrapper: {
    marginTop: 'auto',
  },
  white: {
    color: 'white',
  },
})