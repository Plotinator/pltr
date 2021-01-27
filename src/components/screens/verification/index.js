import React, { Component } from 'react'
import { View, Image, ScrollView, TouchableWithoutFeedback } from 'react-native'
import styles from './styles'
import {
  Text,
  ShellButton,
  Input,
  Button,
  WelcomeToPlottr,
  GoToPlottrDotCom
} from '../../shared/common'
import images from '../../../images'
import * as Animatable from 'react-native-animatable'
import t from 'format-message'
import { Spinner } from 'native-base'

export default class Verification extends Component {
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
                {t("Let's verify your license.")}
              </Text>
              <Text black fontSize='h4' center>
                {t('We will email you a verification code.')}
              </Text>
            </WelcomeToPlottr>
            <Animatable.View
              delay={100}
              duration={1000}
              animation='fadeInUp'
              easing='ease-out-expo'
              style={styles.formSection}>
              <Input friendly placeholder={t('EMAIL')} />
              <Button
                block
                key='check'
                buttonColor='green'
                style={styles.button}
                onPress={this.create}>
                {t('CHECK EMAIL')}
              </Button>
            </Animatable.View>
            <Animatable.View
              key={'or'}
              delay={170}
              duration={1000}
              animation='fadeInUp'
              easing='ease-out-expo'
              style={styles.dontHaveLicense}>
              <Text black fontStyle='bold' fontSize='h4'>
                {t("Don't have a license?")}
              </Text>
            </Animatable.View>
            <Animatable.View
              delay={150}
              duration={1000}
              animation='fadeInUp'
              easing='ease-out-expo'
              style={styles.actionButtons}>
              <Button
                block
                key='create'
                buttonColor='blue'
                style={styles.button}
                onPress={this.create}>
                {t('GET A LICENSE')}
              </Button>
              <View style={styles.or}>
                <Text fontStyle={'bold'}>{t('or')}</Text>
              </View>
              <Button
                block
                key={'select'}
                style={styles.button}
                onPress={this.create}>
                {t('START MOBILE SUBSCRIPTION')}
              </Button>
              <GoToPlottrDotCom />
            </Animatable.View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    )
  }
}
