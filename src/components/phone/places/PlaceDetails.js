import { cloneDeep } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import t from 'format-message'
import { Container, Content, Form, Input, Label, Item } from 'native-base'
import { actions, selectors, initialState } from 'pltr/v2'
import { StyleSheet } from 'react-native'
import SaveButton from '../../ui/SaveButton'
import AttachmentList from '../../shared/attachments/AttachmentList'

class PlaceDetails extends Component {
  static getDerivedStateFromProps (props, state) {
    const { route, customAttributes, places } = props
    const { isNewPlace, place } = route.params
    let placeObj = isNewPlace ? cloneDeep(initialState.place) : places.find(pl => pl.id == place.id)
    let customAttrs = customAttributes.reduce((acc, attr) => {
      acc[attr.name] = placeObj[attr.name]
      return acc
    }, {})
    return {
      isNewPlace: isNewPlace,
      place: placeObj,
      customAttrs: customAttrs,
      changes: isNewPlace,
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
    const { changes, isNewPlace, place, customAttrs } = this.state
    if (!changes) return
    const values = {
      name: place.name,
      description: place.description,
      notes: place.notes,
      ...customAttrs,
    }
    if (isNewPlace) {
      this.props.actions.addPlaceWithValues(values)
      this.props.navigation.setParams({isNewPlace: false})
    } else {
      this.props.actions.editPlace(place.id, values)
    }
    this.setState({isNewPlace: false, changes: false})
  }

  renderAttachments () {
    const { place, isNewPlace } = this.state
    if (isNewPlace) return null

    return <AttachmentList
      itemType='place'
      item={place}
      navigate={this.props.navigation.navigate}
      only={['bookIds', 'tags']}
    />
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
    const { place } = this.state
    return <Container>
      <Content style={styles.content}>
        <Form style={styles.form}>
          <Item inlineLabel last regular style={styles.label}>
            <Label>{t('Name')}</Label>
            <Input
              value={place.name}
              onChangeText={text => this.setState({place: {...place, name: text}, changes: true})}
              autoCapitalize='words'
            />
          </Item>
          <Item inlineLabel last regular style={styles.label}>
            <Label>{t('Description')}</Label>
            <Input
              value={place.description}
              onChangeText={text => this.setState({place: {...place, description: text}, changes: true})}
              autoCapitalize='sentences'
            />
          </Item>
          { this.renderAttachments() }
          <Item inlineLabel last regular style={[styles.label, styles.afterList]}>
            <Label>{t('Notes')}{' RCE'}</Label>
          </Item>
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

PlaceDetails.propTypes = {
  note: PropTypes.object.isRequired,
  editing: PropTypes.bool.isRequired,
  startEditing: PropTypes.func.isRequired,
  stopEditing: PropTypes.func.isRequired,
  characters: PropTypes.array.isRequired,
  places: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  customAttributes: PropTypes.array.isRequired,
  ui: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    tags: selectors.sortedTagsSelector(state),
    characters: selectors.charactersSortedAtoZSelector(state),
    places: selectors.placesSortedAtoZSelector(state),
    customAttributes: state.customAttributes.places,
    ui: state.ui,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.placeActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaceDetails)