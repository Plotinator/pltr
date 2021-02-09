import React, { useState, useEffect } from 'react'
import { View } from 'native-base'
import { Linking, Image } from 'react-native'
import { getVersion } from 'react-native-device-info'
import t from 'format-message'
import { getUserVerification } from '../../../utils/user_info'
import { Text, ShellButton } from '../common'
import Images from '../../../images'
import styles from './SideBarStyles'

const { PLOTTR_VERTICAL, CLOSE } = Images

export default function SideBar (props) {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    let ignore = false

    async function fetchUserInfo () {
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

  const menu = [
    { name: 'Dashboard', type: 'button', callback: props.closeFile },
    { name: 'Documentation', type: 'button', callback: goToDocs },
    { name: 'Help', type: 'button', callback: goToHelp },
    { name: 'Learn', type: 'button', callback: goToVideos },
    { name: 'Demos', type: 'button', callback: goToDemos }
  ]

  if (userInfo && userInfo.email) {
    menu.push({ name: userInfo.email, type: 'email' })
  }

  // logout
  menu.push({ name: '(Logout)', type: 'logout', callback: props.logout })

  const renderMenuButton = ({ name, callback, type }) => (
    <ShellButton style={styles.button} onPress={callback}>
      <Text style={styles[`${type}Text`]}>{t(name).toUpperCase()}</Text>
    </ShellButton>
  )

  return (
    <View style={styles.container}>
      <ShellButton style={styles.closeButton} onPress={props.closeDrawer}>
        <Image source={CLOSE} style={styles.close} />
      </ShellButton>
      <View style={styles.logoContainer}>
        <Image source={PLOTTR_VERTICAL} style={styles.logo} />
      </View>
      <View style={styles.menu}>{menu.map(renderMenuButton)}</View>
      <View style={styles.version}>
        <Text style={styles.versionText}>v{getVersion()}</Text>
      </View>
    </View>
  )
}
