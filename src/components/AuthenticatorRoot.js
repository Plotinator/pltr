import React, { Component } from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import t from 'format-message'
import Verification from './screens/verification'
import VerificationConfirmation from './screens/verification/Confirmation'
import Subscription from './screens/subscription'
import SubscriptionConfirmation from './screens/subscription/Confirmation'
import ErrorBoundary from './shared/ErrorBoundary'
import { cloneDeep } from 'lodash'

const noHeader = { headerShown: false }
const AuthStack = createStackNavigator()
const AuthInitialState = { data: {} }
const AuthReducer = (state = [], { type, data }) => {
  switch (type) {
    case 'UPDATE_DATA':
      return Object.assign({}, state, { data })
    default:
      return state
  }
}
const _AuthStore = createStore(AuthReducer, AuthInitialState)
const _UpdateData = (data) => _AuthStore.dispatch({ type: 'UPDATE_DATA', data })
let _Navigator

export default class AuthenticatorRoot extends Component {
  constructor (props) {
    super(props)
    const { user, verifying, navigation } = props
    const data = { user: cloneDeep(user), verifying }

    this.state = { ...data }
    _UpdateData(data)
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const { user, verifying } = nextProps
    const data = {
      user: cloneDeep(user),
      verifying
    }
    const wasVerifying = !verifying && prevState.verifying
    const isVerified = user.verified && !prevState.user.verified

    // go to confirmation
    if(wasVerifying && user) {
      // _Navigator.navigate('VerificationConfirmation')
    }

    // track for comparison detections
    prevState.user = user
    prevState.verifying = verifying

    // update store with latest prop data
    _UpdateData(data)
    console.log('NEXT STATE FROM PROPS', prevState)
    return prevState
  }

  componentWillUnmount () {
    // clean ups
    _UpdateData({})
    _Navigator = null
  }

  setNavigator = ref => _Navigator = ref

  render () {
    const { logout, verifyCode, verifyLicense, user } = this.props
    const actions = { logout, verifyCode, verifyLicense }
    const needConfirmation = user && user.email && !user.verified
    const initialRouteName = needConfirmation
      ? 'VerificationConfirmation'
      : 'Verification'
    return (
      <Provider store={_AuthStore}>
        <NavigationContainer ref={this.setNavigator}>
          <ErrorBoundary>
            <AuthStack.Navigator initialRouteName={initialRouteName}>
              <AuthStack.Screen
                name='Verification'
                component={Verification}
                options={noHeader}
                initialParams={actions}
              />
              <AuthStack.Screen
                name='VerificationConfirmation'
                component={VerificationConfirmation}
                options={noHeader}
                initialParams={actions}
              />
              <AuthStack.Screen
                name='Subscription'
                component={Subscription}
                options={noHeader}
                initialParams={actions}
              />
              <AuthStack.Screen
                name='SubscriptionConfirmation'
                component={SubscriptionConfirmation}
                options={noHeader}
                initialParams={actions}
              />
            </AuthStack.Navigator>
          </ErrorBoundary>
        </NavigationContainer>
      </Provider>
    )
  }
}
