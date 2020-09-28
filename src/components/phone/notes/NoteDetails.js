import { cloneDeep } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import t from 'format-message'
import { Container, Content, Form, Input, Label, Item, View } from 'native-base'
import { actions, selectors, initialState } from 'pltr/v2'
import { StyleSheet } from 'react-native'
import SaveButton from '../../ui/SaveButton'
import AttachmentList from '../../shared/attachments/AttachmentList'
import RichTextEditor from '../../ui/RichTextEditor'

class NoteDetails extends Component {
  state = {}
  static getDerivedStateFromProps (props, state) {
    const { route, notes } = props
    const { isNewNote, note } = route.params
    return {
      isNewNote: state.isNewNote || isNewNote,
      note: state.note || (isNewNote ? cloneDeep(initialState.note) : notes.find(n => n.id == note.id)),
      changes: state.changes || isNewNote,
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
    const { changes, isNewNote, note } = this.state
    if (!changes) return
    if (isNewNote) {
      this.props.actions.addNoteWithValues(note.title, note.content)
      this.props.navigation.setParams({isNewNote: false})
    } else {
      this.props.actions.editNote(note.id, note)
    }
    this.setState({isNewNote: false, changes: false})
  }

  renderAttachments () {
    const { note, isNewNote } = this.state
    if (isNewNote) return null

    return <AttachmentList
      itemType='note'
      item={note}
      navigate={this.props.navigation.navigate}
      books
    />
  }

  render () {
    const { note } = this.state
    return <Container style={{flex: 1}}>
      <Content style={styles.content} contentContainerStyle={{flex: 1}}>
        <Form style={styles.form}>
          <Item inlineLabel last regular style={styles.label}>
            <Label>{t('Title')}</Label>
            <Input
              value={note.title}
              onChangeText={text => this.setState({note: {...note, title: text}, changes: true})}
              autoCapitalize='sentences'
            />
          </Item>
          { this.renderAttachments() }
          <View style={[styles.afterList, { flex: 1 }]}>
            <Label>{t('Content')}</Label>
            <RichTextEditor
              initialValue={note.content}
              style={styles.rce}
              onChange={val => this.setState({note: {...note, content: val}, changes: true}) }
            />
          </View>
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
  },
  rce: {
  },
})

NoteDetails.propTypes = {
  note: PropTypes.object.isRequired,
  editing: PropTypes.bool.isRequired,
  startEditing: PropTypes.func.isRequired,
  stopEditing: PropTypes.func.isRequired,
  characters: PropTypes.array.isRequired,
  places: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  notes: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    tags: selectors.sortedTagsSelector(state),
    characters: selectors.charactersSortedAtoZSelector(state),
    places: selectors.placesSortedAtoZSelector(state),
    notes: state.notes,
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
)(NoteDetails)
