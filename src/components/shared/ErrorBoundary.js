import React, { Component } from 'react'
// import setupRollbar from '../../common/utils/rollbar'
// import log from 'electron-log'
import t from 'format-message'
import { View, H1, Text, Button, Icon } from 'native-base'
import { StyleSheet } from 'react-native'
// const rollbar = setupRollbar('ErrorBoundary')

export default class ErrorBoundary extends Component {
  state = {hasError: false}

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV !== 'development') {
      // log.error(error, errorInfo)
      // rollbar.error(error, errorInfo)
    }
    console.error(error, errorInfo)
  }

  render () {
    if (this.state.hasError) {
      return <View style={styles.container}>
        <H1 style={styles.h1}>{t('Something went wrong.')}</H1>
        <Button warning bordered style={styles.button} onPress={() => this.setState({hasError: false})}>
          <Text>{t('Try that again')}</Text><Icon type='FontAwesome5' name='redo' style={{fontSize: 16}} />
        </Button>
      </View>
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  h1: {
    marginVertical: 8,
  },
  button: {
    alignSelf: 'center',
  },
})
