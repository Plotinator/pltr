import React, { Component } from 'react'
import { View, ScrollView, TouchableWithoutFeedback } from 'react-native'
import styles from './styles'
import {
  Text,
  Button,
  WelcomeToPlottr,
  GoToPlottrDotCom
} from '../../shared/common'
import * as Animatable from 'react-native-animatable'
import t from 'format-message'
import { Spinner } from 'native-base'

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
      <ScrollView contentContainerStyle={styles.scroller}>
        <TouchableWithoutFeedback>
          <View style={styles.container}>
            <WelcomeToPlottr>
              <Text black fontStyle='bold' fontSize='h3' center>
                {t('Choose a {platform} mobile subscription', {
                  platform: 'iOS'
                })}
              </Text>
              <Text black fontSize='h4' center>
                {t('that best suits your style and needs.')}
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
                disabled
                buttonColor='gold'
                style={styles.button}
                onPress={this.create}>
                {t('{amount} / Weekly', { amount: '$9.99' })}
              </Button>
              <Button
                block
                buttonColor='orange'
                style={styles.button}
                onPress={this.create}>
                {t('{amount} / Monthly', { amount: '$29.99' })}
              </Button>
              <Button
                block
                disabled
                buttonColor='blue'
                style={styles.button}
                onPress={this.create}>
                {t('{amount} / Yearly', { amount: '$299.99' })}
              </Button>
              <Button
                block
                disabled
                buttonColor='green'
                style={styles.button}
                onPress={this.create}>
                {t('{amount} / Lifetime', { amount: '$599.99' })}
              </Button>
              <Button
                key={'back'}
                buttonColor='gray'
                style={styles.button}
                onPress={this.create}>
                {t('Go Back')}
              </Button>
              <GoToPlottrDotCom />
            </Animatable.View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    )
  }
}
