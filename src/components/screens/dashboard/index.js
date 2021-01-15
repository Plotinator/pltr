import React, { Component } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'
import styles from './styles'
import { Text, ShellButton, Button } from '../../shared/common'
import images from '../../../images'
// import DocumentPicker from 'react-native-document-picker'

const { PLOTTR_ICON, PLOTTR_TEXT, PLOTTR_FILE } = images

export default class Dashboard extends Component {
  render () {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.logo} source={PLOTTR_ICON} />
          <View style={styles.welcomeSection}>
            <Text fontStyle='light' fontSize='h1'>
              Welcome to
            </Text>
            <Image style={styles.logoText} source={PLOTTR_TEXT} />
          </View>
          <Text fontStyle='light' color='black' center>
            {'You may create a new project\nor select a project file to begin'}
          </Text>
          {/*
            <Text fontStyle='light' color='black'>Open one of your most recent projects</Text>
            <View style={styles.recentFiles}>
              <ShellButton style={styles.project}>
                <Image source={PLOTTR_FILE} style={styles.fileIcon} />
                <Text fontStyle='semiBold' fontSize='h6' center>
                  Pizza Planet: Another Slice
                </Text>
              </ShellButton>
              <ShellButton style={styles.project}>
                <Image source={PLOTTR_FILE} style={styles.fileIcon} />
                <Text fontStyle='semiBold' fontSize='h6' center>
                  New Project
                </Text>
              </ShellButton>
              <ShellButton style={styles.project}>
                <Image source={PLOTTR_FILE} style={styles.fileIcon} />
                <Text fontStyle='semiBold' fontSize='h6' center>
                  Nancy Drew: Redux
                </Text>
              </ShellButton>
              <ShellButton style={styles.project}>
                <Image source={PLOTTR_FILE} style={styles.fileIcon} />
                <Text fontStyle='semiBold' fontSize='h6' center>
                  Harry Potter Draft
                </Text>
              </ShellButton>
            </View>
          */}
          <View style={styles.actionButtons}>
            <Button block style={styles.button}>
              SELECT PROJECT FILE
            </Button>
            <Button block buttonColor='green' style={styles.button}>
              CREATE NEW PROJECT
            </Button>
          </View>
        </View>
      </View>
    )
  }
}
