import { sortBy } from 'lodash'
import React, { Component } from 'react'
import { SwipeListView } from 'react-native-swipe-list-view'
import { StyleSheet, Animated } from 'react-native'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'pltr/v2'
import { View, ListItem, Icon, Left, Right, H3, Text, Button } from 'native-base'
import t from 'format-message'
import TrashButton from '../../ui/TrashButton'
import { askToDelete } from '../../../utils/delete'

class NotesList extends Component {

  deleteNote = (note) => {
    askToDelete(note.title, () => this.props.actions.deleteNote(note.id))
  }

  navigateToDetails = (note) => {
    this.props.navigation.navigate('NoteDetails', { note })
  }

  renderNote = ({item}) => {
    return <ListItem noIndent button style={styles.row} onPress={() => this.navigateToDetails(item)}>
      <Left>
        <H3 style={styles.title}>{item.title || t('New Note')}</H3>
      </Left>
      <Right>
        <Icon type='FontAwesome5' name='chevron-right'/>
      </Right>
    </ListItem>
  }

  render () {
    const notes = sortBy(this.props.notes, ['lastEdited'])
    return <SwipeListView
      data={notes}
      renderItem={this.renderNote}
      renderHiddenItem={ (data, rowMap) => <TrashButton onPress={() => this.deleteNote(data.item)} />}
      keyExtractor={item => item.id}
      leftOpenValue={75}
    />
  }
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: 'white',
  },
  title: {
    paddingVertical: 4,
  },
  hiddenRow: {

  }
})

NotesList.propTypes = {
  notes: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  characters: PropTypes.array.isRequired,
  places: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  ui: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    notes: state.notes,
    characters: state.characters,
    places: state.places,
    tags: state.tags,
    ui: state.ui,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.noteActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotesList)