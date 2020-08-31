import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'pltr/v2'
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { Icon, H1 } from 'native-base'
import i18n from 'format-message'

class AttachmentSelectorModal extends Component {
  constructor (props) {
    super(props)
    const { route } = props
    const { type, item, itemType, selectedIds } = route.params
    this.state = { type, item, itemType, selectedIds }
  }

  componentWillReceiveProps (newProps) {
    let selected = newProps.item[this.state.type] || []
    this.setState({ selected })
  }

  addIt = (id) => {
    const { actions } = this.props
    switch (this.state.type) {
      case 'characters':
        return actions.addCharacter(this.state.item.id, id)
      case 'places':
        return actions.addPlace(this.state.item.id, id)
      case 'tags':
        return actions.addTag(this.state.item.id, id)
    }
  }

  removeIt = (id) => {
    const { actions } = this.props
    switch (this.state.type) {
      case 'characters':
        return actions.removeCharacter(this.state.item.id, id)
      case 'places':
        return actions.removePlace(this.state.item.id, id)
      case 'tags':
        return actions.removeTag(this.state.item.id, id)
    }
  }

  toggleItem = (id) => {
    let ids = this.state.selectedIds
    if (ids.includes(id)) {
      this.removeIt(id)
    } else {
      this.addIt(id)
    }
  }

  renderCheck = (id) => {
    if (this.state.selectedIds.includes(id)) {
      return <Icon type='FontAwesome5' name='check' style={{color: 'green', fontSize: 12}} />
    } else {
      return null
    }
  }

  renderItem = ({ item }) => {
    let color = {}
    let type = this.state.type
    if (type === 'tags') color = {color: item.color}
    let defaultTitle = `New ${type.substr(0,1).toUpperCase()}${type.substr(1, type.length - 2)}`
    return <View key={`item-${item.id}`} style={styles.listItem}>
      <TouchableOpacity onPress={() => this.toggleItem(item.id)}>
        <View style={[styles.touchableItem, {height: 60}]}>
          <View>
            <Text style={[styles.titleText, color]}>{item.name || item.title || defaultTitle}</Text>
          </View>
          {this.renderCheck(item.id)}
        </View>
      </TouchableOpacity>
    </View>
  }

  render () {
    return <View style={styles.container}>
      <FlatList
        data={this.props[this.state.type]}
        ListEmptyComponent={<H1 style={styles.h1}>{i18n('None to choose')}</H1>}
        extraData={{selected: this.state.selectedIds}}
        keyExtractor={(item) => item.id}
        renderItem={this.renderItem}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  h1: {
    textAlign: 'center',
    marginVertical: 20,
  }
})

AttachmentSelectorModal.propTypes = {
  characters: PropTypes.array.isRequired,
  places: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state, ownProps) {
  return {
    characters: selectors.charactersSortedAtoZSelector(state),
    places: selectors.placesSortedAtoZSelector(state),
    tags: selectors.sortedTagsSelector(state),
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  const { route } = ownProps
  const { itemType } = route.params
  switch (itemType) {
    case 'card':
      return {actions: bindActionCreators(actions.cardActions, dispatch)}
    case 'note':
      return {actions: bindActionCreators(actions.noteActions, dispatch)}
    default:
      break
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttachmentSelectorModal)
