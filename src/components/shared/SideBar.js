import React, { useState, useEffect } from 'react'
import { H3, View, Text, Button, Icon, H1 } from 'native-base'
import { SafeAreaView, StyleSheet, Linking } from 'react-native'
import { getVersion } from 'react-native-device-info'
import t from 'format-message'
import { getUserVerification } from '../../utils/user_info'

export default function SideBar (props) {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    let ignore = false

    async function fetchUserInfo() {
      const fetchedInfo = await getUserVerification()
      if (!ignore) setUserInfo(fetchedInfo)
    }

    fetchUserInfo()
    return () => (ignore = true)
  }, [])

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

  console.log('LOGOUT', props.logout)

  //gray-9
  return <View style={{flex: 1, backgroundColor: 'hsl(210, 36%, 96%)'}}>
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.wrapper}>
        <View style={styles.menuTitle}>
          <H1>{t('Menu')}</H1>
          <Button light style={styles.closeButton} onPress={props.closeDrawer}><Icon type='FontAwesome5' name='times'/></Button>
        </View>
        <View style={styles.buttonWrapper}>
          <Button iconLeft bordered style={styles.button} onPress={props.closeFile}><Icon type='FontAwesome5' name='tachometer-alt' style={styles.icon}/><Text style={styles.text}>{t('Dashboard')}</Text></Button>
          <Button iconLeft bordered style={styles.button} onPress={goToDocs}><Icon type='FontAwesome5' name='book-open' style={styles.icon}/><Text style={styles.text}>{t('Documentation')}</Text></Button>
          <Button iconLeft bordered style={styles.button} onPress={goToHelp}><Icon type='FontAwesome5' name='life-ring' style={styles.icon}/><Text style={styles.text}>{t('Help')}</Text></Button>
          <Button iconLeft bordered style={styles.button} onPress={goToVideos}><Icon type='FontAwesome5' name='video' style={styles.icon}/><Text style={styles.text}>{t('Learn')}</Text></Button>
          <Button iconLeft bordered style={styles.button} onPress={goToDemos}><Icon type='FontAwesome5' name='file-alt' style={styles.icon}/><Text style={styles.text}>{t('Demos')}</Text></Button>
        </View>
        <View style={styles.bottomInfoWrapper}>
          <View style={styles.userInfo}>
            <View style={styles.logoutWrapper}>
              <Text note>{t('Email:')}</Text>
              <Button transparent onPress={props.logout}><Text>{t('(Logout)')}</Text></Button>
            </View>
            <Text>{userInfo ? userInfo.email : null}</Text>
          </View>
          <Text note>{t('App Version: {version}', {version: getVersion()})}</Text>
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
  menuTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonWrapper: {
    padding: 16,
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
  },
  closeButton: {
    // backgroundColor: '#f4f4f4',
    backgroundColor: 'white',
    borderColor: '#f4f4f4',
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
  bottomInfoWrapper: {
    marginTop: 'auto',
  },
  white: {
    color: 'white',
  },
  userInfo: {
    marginVertical: 16,
  },
  logoutWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})