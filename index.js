/**
 * @format
 */

import t from 'format-message'
import { locales } from './src/locales'
t.setup({ translations: locales, locale: 'en' }) // different locales?
import 'react-native-gesture-handler'
import { AppRegistry } from 'react-native'
import { name as appName } from './app.json'
import App from './src/components/App'

// hide yellow warnings
console.disableYellowBox = true

AppRegistry.registerComponent(appName, () => App)
