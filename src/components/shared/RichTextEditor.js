import React from 'react'
import { WebView } from 'react-native-webview'
import { RCE_URL } from '../../utils/constants'
import { StyleSheet } from 'react-native'
import { Spinner, View } from 'native-base'

export default function RichTextEditor (props) {
  const injectValue = `
    window.injectedText = ${JSON.stringify(props.initialValue)};
    window.isNativeApp = true;
    ${props.readOnly ? 'window.readOnly = true;' : ''}
    true;
  `

  const change = event => {
    const stuff = JSON.parse(event.nativeEvent.data)
    console.log(stuff[0].children)
    props.onChange(JSON.parse(event.nativeEvent.data))
  }

  return <WebView
    containerStyle={{flex: 0, height: '100%'}}
    style={[styles.webview, props.style]}
    source={{ uri: RCE_URL }}
    onMessage={change}
    injectedJavaScriptBeforeContentLoaded={injectValue}
    renderLoading={() => <View style={styles.loader}><Spinner color='orange'/></View>}
    startInLoadingState
    bounces={false}
    onError={(syntheticEvent) => {
      const { nativeEvent } = syntheticEvent
      console.log('WebView error: ', nativeEvent)
    }}
  />
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: 0,
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  }
})
