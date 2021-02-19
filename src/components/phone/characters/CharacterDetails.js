import { cloneDeep } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import t from 'format-message'
import { Label, View, Item } from 'native-base'
import { actions, selectors, initialState } from 'pltr/v2'
import { StyleSheet } from 'react-native'
import SaveButton from '../../ui/SaveButton'
import AttachmentList from '../../shared/attachments/AttachmentList'
import CategoryPicker from '../../ui/CategoryPicker'
import RichTextEditor from '../../shared/RichTextEditor'
import DetailsScrollView from '../shared/DetailsScrollView'
import {
  checkForChanges,
  addLeaveListener,
  removeLeaveListener
} from '../../../utils/Changes'
import { Text, Input } from '../../shared/common'
import Fonts from '../../../fonts'

class CharacterDetails extends Component {
  state = {}
  static getDerivedStateFromProps (props, state) {
    const { route, customAttributes, characters } = props
    const { isNewCharacter, character } = route.params
    let characterObj =
      state.character ||
      (isNewCharacter
        ? cloneDeep(initialState.character)
        : characters.find((ch) => ch.id == character.id))
    let customAttrs =
      state.customAttrs ||
      customAttributes.reduce((acc, attr) => {
        acc[attr.name] = characterObj[attr.name]
        return acc
      }, {})
    return {
      isNewCharacter: state.isNewCharacter || isNewCharacter,
      customAttrs: customAttrs,
      character: characterObj,
      changes: state.changes || isNewCharacter
    }
  }

  componentDidMount () {
    const { navigation } = this.props
    addLeaveListener(navigation, this.checkChanges)
    this.setSaveButton()
  }

  componentDidUpdate () {
    this.setSaveButton()
  }

  componentWillUnmount () {
    const { navigation } = this.props
    removeLeaveListener(navigation, this.checkChanges)
  }

  checkChanges = (event) => {
    const { changes } = this.state
    const { navigation } = this.props
    checkForChanges(event, changes, this.saveChanges, navigation)
  }

  setSaveButton = () => {
    this.props.navigation.setOptions({
      headerRight: () => (
        <SaveButton changes={this.state.changes} onPress={this.saveChanges} />
      )
    })
  }

  saveChanges = () => {
    const { changes, isNewCharacter, character, customAttrs } = this.state
    if (!changes) return
    const values = {
      name: character.name,
      description: character.description,
      notes: character.notes,
      categoryId: character.categoryId,
      templates: character.templates,
      ...customAttrs
    }
    if (isNewCharacter) {
      this.props.actions.addCharacterWithValues(values)
      this.props.navigation.setParams({ isNewCharacter: false })
    } else {
      this.props.actions.editCharacter(character.id, values)
    }
    this.setState({ isNewCharacter: false, changes: false })
  }

  updateTemplateValue = (tId, attr, newValue) => {
    const { character } = this.state
    const newTemplates = character.templates.map((t) => {
      if (t.id == tId) {
        t.attributes = t.attributes.map((at) => {
          if (at.name == attr) {
            at.value = newValue
          }
          return at
        })
      }
      return t
    })

    this.setState({
      character: { ...character, templates: newTemplates },
      changes: true
    })
  }

  changeCategory = (val) => {
    this.setState({
      character: { ...this.state.character, categoryId: val },
      changes: true
    })
  }

  renderAttachments () {
    const { character, isNewCharacter } = this.state
    if (isNewCharacter) return null

    return (
      <AttachmentList
        itemType='character'
        item={character}
        navigate={this.props.navigation.navigate}
        only={['bookIds', 'tags']}
      />
    )
  }

  renderTemplates () {
    return this.state.character.templates.flatMap((t) => {
      return t.attributes.map((attr) => {
        if (attr.type == 'paragraph') {
          const height = attr.value ? 100 * attr.value.length : 150
          return (
            <View key={attr.name} style={[styles.afterList, styles.rceView]}>
              <Text style={styles.labelText}>{attr.name}</Text>
              <RichTextEditor
                initialValue={attr.value}
                onChange={(val) =>
                  this.updateTemplateValue(t.id, attr.name, val)
                }
              />
            </View>
          )
        } else {
          return (
            <View key={attr.name} inlineLabel last regular style={styles.label}>
              <Input
                inset
                label={attr.name}
                value={attr.value}
                onChangeText={(text) =>
                  this.updateTemplateValue(t.id, attr.name, text)
                }
                autoCapitalize='sentences'
              />
            </View>
          )
        }
      })
    })
  }

  renderCustomAttributes () {
    const { customAttributes } = this.props
    const { customAttrs } = this.state
    return customAttributes.map((attr, idx) => {
      const { name, type } = attr
      if (type == 'paragraph') {
        return (
          <View key={idx} style={[styles.afterList, styles.rceView]}>
            <Text style={styles.labelText}>{name}</Text>
            <RichTextEditor
              initialValue={customAttrs[name]}
              onChange={(val) =>
                this.setState({
                  customAttrs: { ...customAttrs, [name]: val },
                  changes: true
                })
              }
            />
          </View>
        )
      } else {
        return (
          <View key={idx} inlineLabel last regular style={styles.label}>
            <Input
              inset
              label={name}
              value={customAttrs[name]}
              onChangeText={(text) =>
                this.setState({
                  customAttrs: { ...customAttrs, [name]: text },
                  changes: true
                })
              }
              autoCapitalize='sentences'
            />
          </View>
        )
      }
    })
  }

  render () {
    const { character } = this.state
    return (
      <DetailsScrollView>
        <View inlineLabel last regular style={styles.label}>
          <Input
            inset
            label={t('Name')}
            value={character.name}
            onChangeText={(text) =>
              this.setState({
                character: { ...character, name: text },
                changes: true
              })
            }
            autoCapitalize='words'
          />
        </View>
        <View inlineLabel last regular style={styles.label}>
          <Input
            inset
            label={`${t('Description')}:`}
            value={character.description}
            onChangeText={(text) =>
              this.setState({
                character: { ...character, description: text },
                changes: true
              })
            }
            autoCapitalize='sentences'
          />
        </View>
        <Item fixedLabel style={styles.label}>
          <Text style={styles.labelText}>{t('Category')}</Text>
          <CategoryPicker
            type='characters'
            selectedId={character.categoryId}
            onChange={this.changeCategory}
          />
        </Item>
        {this.renderAttachments()}
        <View style={[styles.afterList, styles.rceView]}>
          <Text style={styles.labelText}>{t('Notes')}</Text>
          <RichTextEditor
            initialValue={character.notes}
            onChange={(val) =>
              this.setState({
                character: { ...character, notes: val },
                changes: true
              })
            }
          />
        </View>
        {this.renderTemplates()}
        {this.renderCustomAttributes()}
      </DetailsScrollView>
    )
  }
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 16
  },
  afterList: {
    marginTop: 16
  },
  rceView: {
    marginBottom: 16
  },
  badge: {
    marginRight: 8
  },
  labelText: {
    ...Fonts.style.semiBold,
    fontSize: Fonts.size.h5
  }
})

CharacterDetails.propTypes = {
  note: PropTypes.object.isRequired,
  editing: PropTypes.bool.isRequired,
  startEditing: PropTypes.func.isRequired,
  stopEditing: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  characters: PropTypes.array.isRequired,
  places: PropTypes.array.isRequired,
  customAttributes: PropTypes.array.isRequired,
  ui: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

function mapStateToProps (state) {
  return {
    tags: selectors.sortedTagsSelector(state),
    characters: selectors.charactersSortedAtoZSelector(state),
    places: selectors.placesSortedAtoZSelector(state),
    customAttributes: state.customAttributes.characters,
    ui: state.ui
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.character, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterDetails)
