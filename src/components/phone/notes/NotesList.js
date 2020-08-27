import { sortBy } from 'lodash'
import React, { Component } from 'react'
import { SwipeListView } from 'react-native-swipe-list-view'
import { StyleSheet, Animated } from 'react-native'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'pltr/v2'
import { View, ListItem, Icon, Left, Right, H3, Text, Button } from 'native-base'
import i18n from 'format-message'

class NotesList extends Component {

  deleteNote = (id) => {
    this.props.actions.deleteNote(id)
  }

  navigateToDetails = (note) => {
    this.props.navigation.navigate('NoteDetails', { note })
  }

  renderNote = ({item}) => {
    return <ListItem noIndent button style={styles.row} onPress={() => this.navigateToDetails(item)}>
      <Left>
        <H3 style={styles.title}>{item.title || i18n('New Note')}</H3>
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
      renderHiddenItem={ (data, rowMap) => {
        const note = data.item
        return <Button full danger style={[ { flex: 1, width: 75 } ]} onPress={() => this.deleteNote(note.id)} >
          <Icon type='FontAwesome5' name='trash'/>
        </Button>
      }}
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