import React from 'react'
import { WebView } from 'react-native-webview'
import { RCE_URL } from '../../utils/constants'
import { StyleSheet, Platform } from 'react-native'
import { Spinner, View, Text, Icon } from 'native-base'
import t from 'format-message'

const isAndroid = Platform.OS == 'android'

export default function RichTextEditor (props) {
  const showWarning = isAndroid && !props.readOnly
  const injectValue = `
    window.injectedText = ${JSON.stringify(props.initialValue)};
    window.isNativeApp = true;
    window.isAndroid = ${isAndroid};
    ${props.readOnly ? 'window.readOnly = true;' : ''}
    true;
  `

  const displayWarning = () => {
    if (!showWarning) return null

    //yellow-5
    return <View style={styles.warning}>
      <Icon type='FontAwesome5' name='exclamation-triangle' style={{fontSize: 14, marginRight: 4, color: 'hsl(44, 92%, 63%)'}}/>
      <Text note>{t('Compatibility on this device is prone to errors')}</Text>
    </View>
  }

  return <View style={{flex: 1}}>
    { displayWarning() }
    <WebView
      containerStyle={{flex: 0, height: '100%'}}
      style={[styles.webview, props.style]}
      source={{ uri: RCE_URL }}
      onMessage={event => props.onChange(JSON.parse(event.nativeEvent.data))}
      injectedJavaScriptBeforeContentLoaded={injectValue}
      renderLoading={() => <View style={styles.loader}><Spinner color='orange'/></View>}
      startInLoadingState
      bounces={false}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent
        console.log('WebView error: ', nativeEvent)
      }}
    />
  </View>
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
  },
  warning: {
    flexDirection: 'row',
  },
})
