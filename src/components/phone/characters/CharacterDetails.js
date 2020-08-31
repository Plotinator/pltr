import { cloneDeep } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import i18n from 'format-message'
import { Text, Container, Content, H1, H2, Form, Input, Label, Item, Button, Picker, List, Left, Right, Badge, View, ListItem, Body, Icon } from 'native-base'
import { actions, selectors, initialState } from 'pltr/v2'
import { StyleSheet } from 'react-native'
import SaveButton from '../../ui/SaveButton'
import AttachmentList from '../attachments/AttachmentList'
import CategoryPicker from '../../ui/CategoryPicker'

class CharacterDetails extends Component {
  constructor (props) {
    super(props)
    const { route, customAttributes } = props
    const { isNewCharacter, character } = route.params
    let customAttrs = {}
    let characterObj = isNewCharacter ? {...cloneDeep(initialState.character)} : character
    customAttributes.forEach(attr => {
      const { name } = attr
      customAttrs[name] = characterObj[name]
    })
    let templateAttrs = characterObj.templates.reduce((acc, t) =>{
      acc[t.id] = t.attributes.reduce((obj, attr) => {
        obj[attr.name] = attr.value
        return obj
      }, {})
      return acc
    }, {})
    this.state = {
      isNewCharacter: isNewCharacter,
      templateAttrs: templateAttrs,
      customAttrs: customAttrs,
      character: characterObj,
      changes: isNewCharacter,
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
    const { changes, isNewCharacter, character, customAttrs, templates } = this.state
    if (!changes) return
    if (isNewCharacter) {
      this.props.actions.addCharacterWithValues(character)
      this.props.navigation.setParams({isNewCharacter: false})
    } else {
      const values = {
        name: character.name,
        description: character.description,
        notes: character.notes,
        categoryId: character.categoryId,
        templates: templates,
        ...customAttrs,
      }
      this.props.actions.editCharacter(character.id, values)
    }
    this.setState({isNewCharacter: false, changes: false})
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
          return <Item key={attr.name} inlineLabel last regular style={styles.label}>
            <Label>{attr.name}{' RCE'}</Label>
          </Item>
        } else {
          return <Item key={attr.name} inlineLabel last regular style={styles.label}>
            <Label>{attr.name}</Label>
            <Input
              value={attr.value}
              onChangeText={text => this.setState({templateAttrs: {...templateAttrs, [attr.name]: text}, changes: true})}
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
        return <Item key={idx} inlineLabel last regular style={styles.label}>
          <Label>{name}{' RCE'}</Label>
        </Item>
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
    return <Container>
      <Content style={styles.content}>
        <Form style={styles.form}>
          <Item inlineLabel last regular style={styles.label}>
            <Label>{i18n('Name')}</Label>
            <Input
              value={character.name}
              onChangeText={text => this.setState({character: {...character, name: text}, changes: true})}
              autoCapitalize='words'
            />
          </Item>
          <Item inlineLabel last regular style={styles.label}>
            <Label>{i18n('Description')}</Label>
            <Input
              value={character.description}
              onChangeText={text => this.setState({character: {...character, description: text}, changes: true})}
              autoCapitalize='sentences'
            />
          </Item>
          <Item fixedLabel style={styles.label}>
            <Label>{i18n('Category')}</Label>
            <CategoryPicker type='characters' selectedId={character.categoryId} onChange={this.changeCategory} />
          </Item>
          { this.renderAttachments() }
          <Item inlineLabel last regular style={[styles.label, styles.afterList]}>
            <Label>{i18n('Notes')}{' RCE'}</Label>
          </Item>
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
