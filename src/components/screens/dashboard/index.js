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
import * as Animatable from 'react-native-animatable'
import t from 'format-message'
import { Spinner } from 'native-base'

const { PLOTTR_ICON, PLOTTR_TEXT, PLOTTR_FILE } = images

export default class Dashboard extends Component {
  renderCTAButtons () {
    const { createDocument, openDocument, loading } = this.props
    return [
      <Button
        block
        key='create'
        buttonColor='green'
        style={styles.button}
        onPress={createDocument}>
        {t('CREATE NEW PROJECT')}
      </Button>,
      <Button
        block
        key={'select'}
        style={styles.button}
        onPress={openDocument}>
        {t('SELECT PROJECT FILE')}
      </Button>
    ]
  }

  renderLoader () {
    return (
      <View style={styles.loader}>
        <Spinner color='orange' />
      </View>
    )
  }

  renderRecentDocument = (document, i) => {
    const { readDocument } = this.props
    return (
      <RecentDocument
        key={i}
        index={i}
        document={document}
        onPress={readDocument}
      />
    )
  }

  renderRecentDocuments (hasRecent) {
    const { loading, recentDocuments } = this.props
    return hasRecent ? (
      [
        <Animatable.View
          key={'recents'}
          delay={100}
          duration={1000}
          animation='fadeInUp'
          easing='ease-out-expo'
          style={styles.recentFiles}>
          {recentDocuments.map(this.renderRecentDocument)}
        </Animatable.View>,
        <Animatable.View
          key={'or'}
          delay={120}
          duration={1000}
          animation='fadeInUp'
          easing='ease-out-expo'
          style={styles.or}>
            <Text fontStyle={'bold'}>
              OR
            </Text>
        </Animatable.View>
      ]
    ) : null
  }

  render () {
    const { loading, recentDocuments } = this.props
    const hasRecentDocuments = recentDocuments.length
    console.log('LOADING', loading)
    return (
      <View style={styles.container}>
        <Animatable.View
          animation='fadeInUp'
          easing='ease-out-expo'
          duration={1000}
          style={styles.header}>
          <Image style={styles.logo} source={PLOTTR_ICON} />
          <View style={styles.welcomeSection}>
            <Text fontStyle='light' fontSize='h1'>
              {t('Welcome to')}
            </Text>
            <Image style={styles.logoText} source={PLOTTR_TEXT} />
          </View>
          {hasRecentDocuments ? (
            <Text fontStyle='light' color='black'>
              {t('Open one of your most recent projects')}
            </Text>
          ) : (
            <Text fontStyle='light' color='black' center>
              {t('You may create a new project')}
            </Text>
          )}
        </Animatable.View>
        {this.renderRecentDocuments(hasRecentDocuments)}
        <Animatable.View
          delay={hasRecentDocuments ? 150 : 100}
          duration={1000}
          animation='fadeInUp'
          easing='ease-out-expo'
          style={styles.actionButtons}>
          {loading ? this.renderLoader() : this.renderCTAButtons()}
        </Animatable.View>
      </View>
    )
  }
}

class RecentDocument extends Component {
  handleSelect = () => {
    const { index, document, onPress } = this.props
    onPress(document, index)
  }
  render () {
    const { index, document: { name } } = this.props
    return (
      <ShellButton
        delay={300 + index * 100}
        duration={600}
        animation='fadeIn'
        easing={'ease-out-back'}
        style={styles.project}
        onPress={this.handleSelect}>
        <Image source={PLOTTR_FILE} style={styles.fileIcon} />
        <Text fontStyle='semiBold' fontSize='h6' center>
          {name}
        </Text>
      </ShellButton>
    )
  }
}
