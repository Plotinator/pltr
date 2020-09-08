import { cloneDeep } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import t from 'format-message'
import { Container, Content, Form, Input, Label, Item } from 'native-base'
import { actions, selectors, initialState } from 'pltr/v2'
import { StyleSheet, Dimensions, View, ScrollView } from 'react-native'
import SaveButton from '../../ui/SaveButton'
import { ColorWheel } from 'react-native-color-wheel'
import tinycolor from 'tinycolor2'

class PlotlineDetails extends Component {
  constructor (props) {
    super(props)
    const { route } = props
    const { line } = route.params
    const color = tinycolor(line.color)
    console.log('color.toHexString()', color.toHexString())
    this.state = {
      changes: false,
      line: line,
      color: color.toHexString(),
    }
  }

  componentDidMount () {
    this.setSaveButton()
  }

  componentDidUpdate () {
    this.setSaveButton()
  }

  setSaveButton = () => {
    console.log('setSaveButton', this.state)
    this.props.navigation.setOptions({
      headerRight: () => <SaveButton changes={this.state.changes} onPress={this.saveChanges} />
    })
  }

  saveChanges = () => {
    const { changes, line, color } = this.state
    if (!changes) return
    this.props.actions.editLine(line.id, line.title, color)
    this.setState({changes: false})
  }

  setNewColor = (hsvColor) => {
    // TODO: Fix this
    console.log('HSV before', hsvColor.h)
    if (hsvColor.h < 0) hsvColor.h = hsvColor.h * -1 + 100
    console.log('HSV after', hsvColor.h)
    const color = tinycolor(hsvColor)
    this.setState({color: color.toHexString(), changes: true})
  }

  render () {
    const { line, color } = this.state
    // copied from TagDetails
    // TODO: when I fix it there, i'll need to fix it here too
    return <Container>
      <Form style={styles.form}>
        <Item inlineLabel last regular style={styles.label}>
          <Label>{t('Title')}</Label>
          <Input
            value={line.title}
            onChangeText={text => this.setState({line: {...this.state.line, title: text}, changes: true})}
            autoCapitalize='sentences'
          />
        </Item>
        <Item inlineLabel last regular style={[styles.label, styles.afterList]}>
          <Label>{t('Color')}</Label>
          <View style={[styles.currentColor, {backgroundColor: color}]}></View>
        </Item>
      </Form>
      <View style={{flex: 1}}>
        <Label style={styles.content}>{t('Change Color:')}</Label>
        <ColorWheel
          initialColor={color}
          onColorChange={this.setNewColor}
          // onColorChangeComplete={this.setNewColor}
          style={styles.colorWheel}
          thumbSize={30}
        />
      </View>
    </Container>
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  label: {
    marginBottom: 16,
  },
  afterList: {
    marginTop: 16,
  },
  form: {
    padding: 16,
    marginTop: 16,
  },
  currentColor: {
    height: 50,
    width: 50,
  },
  colorWheel: {
    width: Dimensions.get('window').width,
    elevation: 300,
  },
})

PlotlineDetails.propTypes = {
  lines: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    lines: state.lines,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.lineActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlotlineDetails)
