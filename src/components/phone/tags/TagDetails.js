import { cloneDeep } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import t from 'format-message'
import { Container, Content, Form, Input, Label, Item, H3, Button, Text } from 'native-base'
import { actions, selectors, initialState } from 'pltr/v2'
import { StyleSheet, Dimensions, View, ScrollView } from 'react-native'
import SaveButton from '../../ui/SaveButton'
import tinycolor from 'tinycolor2'

class TagDetails extends Component {
  state = {}

  static getDerivedStateFromProps (props, state) {
    const { route, tags } = props
    const { isNewTag, tag } = route.params
    const tagObj = isNewTag ? cloneDeep(initialState.tag) : tags.find(t => t.id == tag.id)
    return {
      isNewTag: state.isNewTag || isNewTag,
      changes: state.changes || isNewTag,
      id: state.id || tagObj.id,
      title: state.title || tagObj.title,
      color: state.changes && state.color ? state.color : tagObj.color,
      colorFromRedux: tagObj.color,
    }
  }

  componentDidMount () {
    this.setSaveButton()
  }

  componentDidUpdate () {
    this.setSaveButton()
  }

  setSaveButton = () => {
    this.props.navigation.setOptions({
      headerRight: () => <SaveButton changes={this.state.changes} onPress={this.saveChanges} />
    })
  }

  saveChanges = () => {
    const { changes, isNewTag, id, title, color } = this.state
    if (!changes) return
    if (isNewTag) {
      this.props.actions.addTagWithValues(title, color)
      this.props.navigation.setParams({isNewTag: false})
    } else {
      this.props.actions.editTag(id, title, color)
    }
    this.setState({isNewTag: false, changes: false})
  }

  navigateToColorPicker = () => {
    const { id, colorFromRedux } = this.state
    this.props.navigation.push('ColorPickerModal', {type: 'tag', id})
    // conscious trade-off here
    // this wipes out their typed color changes
    // but options are: 1. wipe out changes, 2. wipe out knowledge of changes (couldn't save), 3. don't show picked color
    this.setState({changes: false, color: colorFromRedux})
  }

  render () {
    const { title, color } = this.state
    const colorObj = tinycolor(color)
    const backgroundColor = {backgroundColor: colorObj.toHexString()}

    return <Container>
      <Form style={styles.form}>
        <Item inlineLabel last regular style={styles.label}>
          <Label>{t('Title')}</Label>
          <Input
            value={title}
            onChangeText={text => this.setState({title: text, changes: true})}
            autoCapitalize='sentences'
          />
        </Item>
        <Item inlineLabel last regular style={styles.label}>
          <Label>{t('Color')}</Label>
          <Input
            value={color}
            onChangeText={text => this.setState({color: text, changes: true})}
          />
        </Item>
        <View style={styles.colorWrapper}>
          <H3>{t('Current Color')}</H3>
          <View style={[styles.colorSwatch, backgroundColor]} />
          <Button bordered light style={styles.button} onPress={this.navigateToColorPicker}><Text style={styles.buttonText}>{t('Choose Color')}</Text></Button>
        </View>
      </Form>
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
  colorWrapper: {
    marginTop: 8,
    alignItems: 'center',
  },
  colorSwatch: {
    width: 60,
    height: 50,
    margin: 8,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  button: {
    alignSelf: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'black',
  }
})

TagDetails.propTypes = {
  characters: PropTypes.array.isRequired,
  places: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    tags: selectors.sortedTagsSelector(state),
    characters: selectors.charactersSortedAtoZSelector(state),
    places: selectors.placesSortedAtoZSelector(state),
    ui: state.ui,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.tagActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagDetails)
