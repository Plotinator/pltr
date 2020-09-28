import React from 'react'
import { WebView } from 'react-native-webview'
import { RCE_URL } from '../../utils/constants'
import { StyleSheet } from 'react-native'
import { Spinner } from 'native-base'

export default function RichTextEditor (props) {
  const injectValue = `
    window.injectedText = ${JSON.stringify(props.initialValue)};
    window.isNativeApp = true;
    true;
  `
  return <WebView
    containerStyle={{flex: 0, height: '100%'}}
    style={[styles.webview, props.style]}
    source={{ uri: RCE_URL }}
    onMessage={event => props.onChange(JSON.parse(event.nativeEvent.data))}
    injectedJavaScriptBeforeContentLoaded={injectValue}
    renderLoading={() => <Spinner color='orange'/>}
    startInLoadingState
    onError={(syntheticEvent) => {
      const { nativeEvent } = syntheticEvent
      console.log('WebView error: ', nativeEvent)
    }}
  />
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  }
})
