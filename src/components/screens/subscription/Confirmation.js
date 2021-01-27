import React, { Component } from 'react'
import { View, Image } from 'react-native'
import styles from './styles'
import {
  Text,
  Button,
  WelcomeToPlottr,
  GoToPlottrDotCom
} from '../../shared/common'
import Images from '../../../images'
import * as Animatable from 'react-native-animatable'
import t from 'format-message'
import { Spinner } from 'native-base'

const { BIRTHDAY_EMOJI } = Images

export default class Subscription extends Component {
  renderLoader () {
    return (
      <View style={styles.loader}>
        <Spinner color='orange' />
      </View>
    )
  }

  render () {
    const { loading, recentDocuments } = this.props
    const hasRecentDocuments = recentDocuments.length
    return (
      <View style={styles.container}>
        <WelcomeToPlottr>
          <Image source={BIRTHDAY_EMOJI} style={styles.emoji} />
          <Text black fontStyle='bold' fontSize='h3' center>
            {t('Awesome choice!')}
          </Text>
          <Text black fontSize='h4' center>
            {t('Now lets get you writing your first plot!')}
          </Text>
        </WelcomeToPlottr>
        <Animatable.View
          delay={150}
          duration={1000}
          animation='fadeInUp'
          easing='ease-out-expo'
          style={styles.actionButtons}>
          <Button
            block
            buttonColor='green'
            style={styles.button}
            onPress={this.create}>
            {t('GET STARTED!')}
          </Button>
        </Animatable.View>
        <GoToPlottrDotCom />
      </View>
    )
  }
}
