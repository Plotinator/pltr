import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'pltr/v2'
import { StyleSheet, View, FlatList, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native'
import { Icon, H1, Item, Input, Button, Label, Container, Content, Text, ListItem, Left, Switch, Body, Right } from 'native-base'
import { SwipeListView } from 'react-native-swipe-list-view'
import t from 'format-message'
import RenameButton from '../../ui/RenameButton'
import TrashButton from '../../ui/TrashButton'
import { askToDelete } from '../../../utils/delete'

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

class CustomAttributesScreen extends Component {
  constructor (props) {
    super(props)
    const { route } = props
    const { type } = route.params
    this.state = { type, text: '' }
  }

  add = () => {
    const { text, type } = this.state
    const { actions, restrictedValues } = this.props
    if (text == '' || restrictedValues.includes(text)) return

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    if (type == 'characters') {
      actions.addCharacterAttr({name: text, type: 'text'})
    }
    if (type == 'places') {
      actions.addPlaceAttr({name: text, type: 'text'})
    }
    this.setState({text: ''})
  }

  deleteAttr = (attr) => {
    const { type } = this.state
    const { actions } = this.props
    if (type == 'characters') {
      askToDelete(attr.name, () => actions.removeCharacterAttr(attr.name))
    }
    if (type == 'places') {
      askToDelete(attr.name, () => actions.removePlaceAttr(attr.name))
    }
  }

  editAttr = (text, attr, index) => {
    const { type } = this.state
    const { actions, restrictedValues } = this.props
    if (text == '' || restrictedValues.includes(text)) return
    if (text == attr.name) return

    if (type == 'characters') {
      actions.editCharacterAttr(index, attr, {...attr, name: text})
    }
    if (type == 'places') {
      actions.editPlaceAttr(index, attr, {...attr, name: text})
    }
  }

  toggleAttr = (val, attr, index) => {
    const { type } = this.state
    const { actions } = this.props
    const newType = val ? 'paragraph' : 'text'

    if (type == 'characters') {
      actions.editCharacterAttr(index, attr, {...attr, type: newType})
    }
    if (type == 'places') {
      actions.editPlaceAttr(index, attr, {...attr, type: newType})
    }
  }

  renderItem = ({ item, index }) => {
    const canChange = this.props.customAttributesThatCanChange.includes(item.name)
    if (canChange) {
      return <ListItem noIndent style={styles.row}>
        <Left>
          <Text>{item.name}</Text>
        </Left>
        <Body>
          <Text>{t('Paragraph?')}</Text>
        </Body>
        <Right>
          <Switch value={item.type == 'paragraph'} onValueChange={val => this.toggleAttr(val, item, index)}/>
        </Right>
      </ListItem>
    } else {
      return <ListItem noIndent style={styles.row}>
        <Left>
          <Text>{item.name}</Text>
        </Left>
        <Body>
          <Text note>{t('Paragraph')}</Text>
        </Body>
      </ListItem>
    }
  }

  render () {
    return <Container>
      <Content padder>
        <View style={styles.container}>
          <Item floatingLabel style={styles.newAttr}>
            <Label>{t('New Custom Attribute Title')}</Label>
            <Input value={this.state.text} onChangeText={text => this.setState({text})} placeholder={t('Enter Custom Attribute Title')}/>
          </Item>
          <Button full success disabled={!this.state.text} onPress={this.add} style={styles.button}><Text>{t('Add')}</Text></Button>
          <SwipeListView
            data={this.props.customAttributes}
            keyExtractor={(item) => item.name}
            renderItem={this.renderItem}
            renderHiddenItem={ (data, rowMap) => <TrashButton onPress={() => this.deleteAttr(data.item)} />}
            leftOpenValue={75}
          />
        </View>
      </Content>
    </Container>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
  },
  h1: {
    textAlign: 'center',
    marginVertical: 20,
  },
  row: {
    backgroundColor: 'white',
  },
  hiddenRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  button: {
    marginVertical: 8,
  },
  newAttr: {
    marginBottom: 8,
  },
})

CustomAttributesScreen.propTypes = {
  customAttributes: PropTypes.array.isRequired,
  customAttributesThatCanChange: PropTypes.array,
  restrictedValues: PropTypes.array,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state, ownProps) {
  const { route } = ownProps
  const { type } = route.params

  let canChange = []
  let restrictedValues = []
  if (type == 'characters') {
    canChange = selectors.characterCustomAttributesThatCanChangeSelector(state)
    restrictedValues = selectors.characterCustomAttributesRestrictedValues(state)
  } else {
    canChange = selectors.placeCustomAttributesThatCanChangeSelector(state)
    restrictedValues = selectors.placeCustomAttributesRestrictedValues(state)
  }

  return {
    customAttributes: state.customAttributes[type],
    customAttributesThatCanChange: canChange,
    restrictedValues: restrictedValues,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.customAttributeActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomAttributesScreen)
