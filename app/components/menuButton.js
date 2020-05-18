import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppStyles from '../styles'

class MenuButton extends Component {

  pressHandler = () => {
    this.props.navigation.openDrawer()
  }

  render () {
    return <TouchableOpacity onPress={this.pressHandler} >
      <Ionicons name='ios-menu' size={34} style={AppStyles.leftNavButton}/>
    </TouchableOpacity>
  }
}

MenuButton.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default MenuButton
