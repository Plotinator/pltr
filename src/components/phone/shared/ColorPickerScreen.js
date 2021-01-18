import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'pltr/v2'
import ColorPickerList from '../../shared/ColorPickerList'
import { Container, Content } from 'native-base'

class ColorPickerScreen extends Component {

  chooseColor = (color) => {
    const { navigation, route, tagActions, lineActions, seriesLineActions } = this.props
    const { id, type } = route.params

    if (type == 'tag') {
      tagActions.changeColor(id, color)
    } else if (type == 'line') {
      lineActions.editLineColor(id, color)
    } else if (type == 'seriesLine') {
      seriesLineActions.editLineColor(id, color)
    }
    navigation.pop()
  }

  render () {
    return <Container>
      <Content>
        <ColorPickerList chooseColor={this.chooseColor} />
      </Content>
    </Container>
  }
}

ColorPickerScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  tagActions: PropTypes.object.isRequired,
  lineActions: PropTypes.object.isRequired,
  seriesLineActions: PropTypes.object.isRequired,
}

function mapStateToProps (state, ownProps) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    tagActions: bindActionCreators(actions.tagActions, dispatch),
    lineActions: bindActionCreators(actions.lineActions, dispatch),
    seriesLineActions: bindActionCreators(actions.seriesLineActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColorPickerScreen)