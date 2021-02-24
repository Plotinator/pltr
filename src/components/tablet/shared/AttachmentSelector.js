import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'pltr/v2'
import { StyleSheet, FlatList } from 'react-native'
import { Icon, H1, H3, ListItem, CheckBox, Body, Text, View, Badge, Left, Right } from 'native-base'
import Popover from 'react-native-popover-view'
import t from 'format-message'
import { attachmentItemText } from '../../../utils/attachment_titles'

class AttachmentSelector extends Component {
  state = { selected: []}
  static getDerivedStateFromProps (props, state) {
    const { type, item, itemType } = props
    const connectedItem = props[`${itemType}s`].find(things => things.id == item.id)
    return { type, item: connectedItem, itemType, selected: connectedItem[type] }
  }

  addIt = (id) => {
    const { actions } = this.props
    const { type, item } = this.state
    switch (type) {
      case 'characters':
        return actions.addCharacter(item.id, id)
      case 'places':
        return actions.addPlace(item.id, id)
      case 'tags':
        return actions.addTag(item.id, id)
      case 'books':
      case 'bookIds':
        return actions.addBook(item.id, id)
      default:
        return
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
      case 'books':
      case 'bookIds':
        return actions.removeBook(this.state.item.id, id)
      default:
        return
    }
  }

  toggleItem = (id) => {
    let ids = this.state.selected
    if (ids.includes(id)) {
      this.removeIt(id)
    } else {
      this.addIt(id)
    }
  }

  renderItem = ({ item }) => {
    const { type, selected } = this.state
    let color = {}
    if (type == 'tags') color = {backgroundColor: item.color}
    let defaultTitle = `New ${type.substr(0,1).toUpperCase()}${type.substr(1, type.length - 2)}`
    return <ListItem noIndent button key={`item-${item.id}`} style={styles.listItem} onPress={() => this.toggleItem(item.id)}>
      <CheckBox checked={selected.includes(item.id)} onPress={() => this.toggleItem(item.id)}/>
      <Body>
        <View style={styles.rowView}>
          <H3 style={styles.title}>{item.name || item.title || defaultTitle}</H3>
          {type == 'tags' ? <Badge style={[styles.badge, color]}><Text>{item.color}</Text></Badge> : null}
        </View>
      </Body>
    </ListItem>
  }

  render () {
    const { item, type } = this.props
    return <Popover
      from={
        <ListItem>
          <Left>
            <Badge info style={styles.listBadge}><Text>{item[type].length}</Text></Badge>
            <Text>{attachmentItemText(type)}</Text>
          </Left>
          <Right>
            <Icon type='FontAwesome5' name='chevron-right'/>
          </Right>
        </ListItem>
      }
    >
      <FlatList
        data={this.props[this.state.type]}
        ListEmptyComponent={<H1 style={styles.h1}>{t('None to choose')}</H1>}
        extraData={{selected: this.state.selected}}
        keyExtractor={(item) => item.id.toString()}
        renderItem={this.renderItem}
      />
    </Popover>
  }
}

const styles = StyleSheet.create({
  h1: {
    textAlign: 'center',
    marginVertical: 20,
  },
  title: {
    paddingVertical: 4,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  badge: {
    marginTop: 5,
    marginLeft: 20,
  },
  listBadge: {
    marginRight: 8,
  },
  listItem: {
    width: 500,
  },
})

AttachmentSelector.propTypes = {
  characters: PropTypes.array.isRequired,
  places: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  books: PropTypes.object.isRequired,
  cards: PropTypes.array.isRequired,
  notes: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  console.log('BOOKS', state.books)
  return {
    characters: selectors.charactersSortedAtoZSelector(state),
    places: selectors.placesSortedAtoZSelector(state),
    tags: selectors.sortedTagsSelector(state),
    books: state.books,
    bookIds: state.books,
    cards: state.cards,
    notes: state.notes,
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  const { itemType } = ownProps
  switch (itemType) {
    case 'card':
      return {actions: bindActionCreators(actions.card, dispatch)}
    case 'note':
      return {actions: bindActionCreators(actions.note, dispatch)}
    case 'character':
      return {actions: bindActionCreators(actions.character, dispatch)}
    case 'place':
      return {actions: bindActionCreators(actions.place, dispatch)}
    default:
      break
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttachmentSelector)
