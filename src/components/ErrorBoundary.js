import React, { Component } from 'react'
// import setupRollbar from '../../common/utils/rollbar'
// import log from 'electron-log'
import i18n from 'format-message'
import { View, H1, Text } from 'native-base'
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
      console.error(error, errorInfo)
    }
  }

  render () {
    if (this.state.hasError) {
      return <View>
        <H1>{i18n('Something went wrong.')}</H1>
        <Text>{i18n('Try that again, but if it keeps happening, use the help menu to create an error report and report the problem.')}</Text>
      </View>
    }

    return this.props.children
  }
}