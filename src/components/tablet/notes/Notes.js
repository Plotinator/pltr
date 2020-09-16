import { sortBy } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, FlatList } from 'react-native'
import t from 'format-message'
import cx from 'classnames'
import { selectors, actions } from 'pltr/v2'
import { View, H3, Text, Button, H1 } from 'native-base'
import { Col, Grid } from 'react-native-easy-grid'
import ErrorBoundary from '../../ErrorBoundary'
import Toolbar from '../../ui/Toolbar'

class Notes extends Component {
  constructor (props) {
    super(props)
    this.state = {
      noteDetailId: null,
      filter: null,
      viewableNotes: [],
      editingSelected: false,
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnVal = {...state}
    const { notes } = props
    const viewableNotes = Notes.viewableNotes(notes, state.filter)
    returnVal.viewableNotes = viewableNotes
    returnVal.noteDetailId = Notes.detailID(viewableNotes, state.noteDetailId)

    return returnVal
  }

  static viewableNotes (notes, filter) {
    const filterIsEmpty = Notes.staticFilterIsEmpty(filter)
    let viewableNotes = notes
    if (!filterIsEmpty) {
      viewableNotes = notes.filter((n) => Notes.isViewable(filter, n))
    }
    let sortedNotes = sortBy(viewableNotes, ['lastEdited'])
    sortedNotes.reverse()
    return sortedNotes
  }

  static detailID (notes, noteDetailId) {
    if (notes.length == 0) return null

    let id = notes[0].id

    // check for the currently active one
    if (noteDetailId != null) {
      let activeNote = notes.find(n => n.id === noteDetailId)
      if (activeNote) id = activeNote.id
    }

    return id
  }

  // this is a hack for now
  static staticFilterIsEmpty (filter) {
    return filter == null ||
      (filter['tag'].length === 0 &&
      filter['character'].length === 0 &&
      filter['place'].length === 0 &&
      filter['book'].length === 0)
  }

  static isViewable (filter, note) {
    if (!note) return false
    let visible = false
    if (note.tags) {
      if (filter['tag'].some(tId => note.tags.includes(tId))) visible = true
    }
    if (note.characters) {
      if (filter['character'].some(cId => note.characters.includes(cId))) visible = true
    }
    if (note.places) {
      if (filter['place'].some(pId => note.places.includes(pId))) visible = true
    }
    if (note.bookIds) {
      if (filter['book'].some(bookId => note.bookIds.includes(bookId))) visible = true
      // if the filter includes books, and this note has no bookIds,
      // it's considered in all books, so it should be visible
      if (filter['book'].length && !note.bookIds.length) visible = true
    }
    return visible
  }

  renderNoteItem ({item}) {
    return <View>
      <Text>{item.title}</Text>
    </View>
  }

  renderNoteList () {
    const { notes } = this.props
    return <View style={styles.noteList}>
      <H1>{t('Notes')}</H1>
      <FlatList
        data={notes}
        renderItem={this.renderNoteItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  }

  renderNoteDetail () {
    return <View>
      <Text>Details</Text>
    </View>
  }

  render () {
    return <View style={{flex: 1}}>
      <Toolbar>
        <Button bordered><Text>{t('New')}</Text></Button>
      </Toolbar>
      <Grid style={{flex: 1}}>
        <Col size={3}>
          { this.renderNoteList() }
        </Col>
        <Col size={9}>
          { this.renderNoteDetail() }
        </Col>
      </Grid>
    </View>
  }
}

const styles = StyleSheet.create({
  noteList: {
    height: '100%',
    padding: 16,
    backgroundColor: 'white',
    shadowColor: 'hsl(210, 36%, 96%)', //gray-9
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
})

Notes.propTypes = {
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
)(Notes)
