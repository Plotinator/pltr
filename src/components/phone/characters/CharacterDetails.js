import { cloneDeep } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import t from 'format-message'
import { Text, Container, Content, H1, H2, Form, Input, Label, Item, Button, Picker, List, Left, Right, Badge, View, ListItem, Body, Icon } from 'native-base'
import { actions, selectors, initialState } from 'pltr/v2'
import { StyleSheet } from 'react-native'
import SaveButton from '../../ui/SaveButton'
import AttachmentList from '../../shared/attachments/AttachmentList'
import CategoryPicker from '../../ui/CategoryPicker'
import RichTextEditor from '../../shared/RichTextEditor'

class CharacterDetails extends Component {
  state = {}
  static getDerivedStateFromProps (props, state) {
    const { route, customAttributes, characters } = props
    const { isNewCharacter, character } = route.params
    let characterObj = state.character || (isNewCharacter ? cloneDeep(initialState.character) : characters.find(ch => ch.id == character.id))
    let customAttrs = state.customAttrs || customAttributes.reduce((acc, attr) => {
      acc[attr.name] = characterObj[attr.name]
      return acc
    }, {})
    return {
      isNewCharacter: state.isNewCharacter || isNewCharacter,
      customAttrs: customAttrs,
      character: characterObj,
      changes: state.changes || isNewCharacter,
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
    const { changes, isNewCharacter, character, customAttrs } = this.state
    if (!changes) return
    const values = {
      name: character.name,
      description: character.description,
      notes: character.notes,
      categoryId: character.categoryId,
      templates: character.templates,
      ...customAttrs,
    }
    if (isNewCharacter) {
      this.props.actions.addCharacterWithValues(values)
      this.props.navigation.setParams({isNewCharacter: false})
    } else {
      this.props.actions.editCharacter(character.id, values)
    }
    this.setState({isNewCharacter: false, changes: false})
  }

  updateTemplateValue = (tId, attr, newValue) => {
    const { character } = this.state
    const newTemplates = character.templates.map(t => {
      if (t.id == tId) {
        t.attributes = t.attributes.map(at => {
          if (at.name == attr) {
            at.value = newValue
          }
          return at
        })
      }
      return t
    })

    this.setState({character: {...character, templates: newTemplates}, changes: true})
  }

  changeCategory = (val) => {
    this.setState({character: {...this.state.character, categoryId: val}, changes: true})
  }

  renderAttachments () {
    const { character, isNewCharacter } = this.state
    if (isNewCharacter) return null

    return <AttachmentList
      itemType='character'
      item={character}
      navigate={this.props.navigation.navigate}
      only={['bookIds', 'tags']}
    />
  }

  renderTemplates () {
    return this.state.character.templates.flatMap(t => {
      return t.attributes.map(attr => {
        if (attr.type == 'paragraph') {
          const height = attr.value ? 100 * attr.value.length : 150
          return <View key={attr.name} style={[styles.afterList, {height: height, minHeight: 150, marginBottom: 32}]}>
            <Label>{attr.name}</Label>
            <RichTextEditor
              initialValue={attr.value}
              onChange={val => this.updateTemplateValue(t.id, attr.name, val) }
            />
          </View>
        } else {
          return <Item key={attr.name} inlineLabel last regular style={styles.label}>
            <Label>{attr.name}</Label>
            <Input
              value={attr.value}
              onChangeText={text => this.updateTemplateValue(t.id, attr.name, text)}
              autoCapitalize='sentences'
            />
          </Item>
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
        return <View key={idx} style={[styles.afterList, {height: 300, marginBottom: 32}]}>
          <Label>{name}</Label>
          <RichTextEditor
            initialValue={customAttrs[name]}
            style={styles.rce}
            onChange={val => this.setState({customAttrs: {...customAttrs, [name]: val}, changes: true}) }
          />
        </View>
      } else {
        return <Item key={idx} inlineLabel last regular style={styles.label}>
          <Label>{name}</Label>
          <Input
            value={customAttrs[name]}
            onChangeText={text => this.setState({customAttrs: {...customAttrs, [name]: text}, changes: true})}
            autoCapitalize='sentences'
          />
        </Item>
      }
    })
  }

  render () {
    const { character } = this.state
    return <Container style={{flex: 1}}>
      <Content style={styles.content}>
        <Form style={styles.form}>
          <Item inlineLabel last regular style={styles.label}>
            <Label>{t('Name')}</Label>
            <Input
              value={character.name}
              onChangeText={text => this.setState({character: {...character, name: text}, changes: true})}
              autoCapitalize='words'
            />
          </Item>
          <Item inlineLabel last regular style={styles.label}>
            <Label>{t('Description')}</Label>
            <Input
              value={character.description}
              onChangeText={text => this.setState({character: {...character, description: text}, changes: true})}
              autoCapitalize='sentences'
            />
          </Item>
          <Item fixedLabel style={styles.label}>
            <Label>{t('Category')}</Label>
            <CategoryPicker type='characters' selectedId={character.categoryId} onChange={this.changeCategory} />
          </Item>
          { this.renderAttachments() }
          <View style={[styles.afterList, {height: 100 * character.notes.length, minHeight: 150, marginBottom: 32}]}>
            <Label>{t('Notes')}</Label>
            <RichTextEditor
              initialValue={character.notes}
              onChange={val => this.setState({character: {...character, notes: val}, changes: true}) }
            />
          </View>
          { this.renderTemplates() }
          { this.renderCustomAttributes() }
        </Form>
      </Content>
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
    flex: 1,
    marginVertical: 16,
  },
  badge: {
    marginRight: 8,
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
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    tags: selectors.sortedTagsSelector(state),
    characters: selectors.charactersSortedAtoZSelector(state),
    places: selectors.placesSortedAtoZSelector(state),
    customAttributes: state.customAttributes.characters,
    ui: state.ui,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.characterActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CharacterDetails)
