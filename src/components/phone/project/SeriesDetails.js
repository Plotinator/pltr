import { cloneDeep } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import i18n from 'format-message'
import { Container, Content, Form, Input, Label, Item } from 'native-base'
import { actions, selectors, initialState } from 'pltr/v2'
import { StyleSheet, Dimensions, View, ScrollView } from 'react-native'
import SaveButton from '../../ui/SaveButton'

class SeriesDetails extends Component {
  constructor (props) {
    super(props)
    const { route } = props
    const { isNewBook, id } = route.params
    let bookObj = {}
    if (isNewBook) {
      bookObj = cloneDeep(initialState.book)
    } else {
      if (id == 'series') {
        bookObj = props.series
      } else {
        bookObj = props.books[`${id}`]
      }
    }
    this.state = {
      isNewBook: isNewBook,
      changes: isNewBook,
      book: bookObj,
      id: id,
    }
  }

  componentDidMount () {
    const title = this.state.id == 'series' ? i18n('Series') : i18n('Book Details')
    this.props.navigation.setOptions({title})
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
    const { changes, isNewBook, book, id } = this.state
    if (!changes) return
    if (isNewBook) {
      // TODO: need to make adding a plotline/chapter all one action in root
      // this.props.actions.addBook()
      this.props.navigation.setParams({isNewBook: false})
    } else {
      const attrs = ['genre', 'premise', 'theme']
      const createUpdateObj = (acc, attr) => {
        acc[attr] = book[attr]
        return acc
      }
      if (id == 'series') {
        const updateObj = ['name', ...attrs].reduce(createUpdateObj, {})
        this.props.seriesActions.editSeries(updateObj)
      } else {
        const updateObj = ['title', ...attrs].reduce(createUpdateObj, {})
        this.props.actions.editBook(id, updateObj)
      }
    }
    this.setState({isNewBook: false, changes: false})
  }

  render () {
    const { id, book } = this.state
    return <Container>
      <Content style={styles.content}>
        <Form style={styles.form}>
          <Item inlineLabel last regular style={styles.label}>
            <Label>{id == 'series' ? i18n('Name') : i18n('Title')}</Label>
            <Input
              value={id == 'series' ? book.name : book.title}
              onChangeText={text => {
                if (id == 'series') {
                  this.setState({book: {...book, name: text}, changes: true})
                } else {
                  this.setState({book: {...book, title: text}, changes: true})
                }
              }}
              autoCapitalize='words'
            />
          </Item>
          <Item inlineLabel last regular style={styles.label}>
            <Label>{i18n('Genre')}</Label>
            <Input
              value={book.genre}
              onChangeText={text => this.setState({book: {...book, genre: text}, changes: true})}
              autoCapitalize='sentences'
            />
          </Item>
          <Item inlineLabel last regular style={styles.label}>
            <Label>{i18n('Premise')}</Label>
            <Input
              value={book.premise}
              onChangeText={text => this.setState({book: {...book, premise: text}, changes: true})}
              autoCapitalize='sentences'
            />
          </Item>
          <Item inlineLabel last regular style={styles.label}>
            <Label>{i18n('Theme')}</Label>
            <Input
              value={book.theme}
              onChangeText={text => this.setState({book: {...book, theme: text}, changes: true})}
              autoCapitalize='sentences'
            />
          </Item>
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

SeriesDetails.propTypes = {
  series: PropTypes.object.isRequired,
  books: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  seriesActions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    series: state.series,
    books: state.books,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.bookActions, dispatch),
    seriesActions: bindActionCreators(actions.seriesActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesDetails)
