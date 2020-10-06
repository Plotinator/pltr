import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet } from 'react-native'
import t from 'format-message'
import { selectors, actions } from 'pltr/v2'
import { Text, List, ListItem, Button, Icon } from 'native-base'
import Popover from 'react-native-popover-view'

class SeriesPicker extends Component {
  state = {open: false}

  onChange = (val) => {
    this.props.actions.changeCurrentTimeline(val)
    this.setState({open: false})
  }

  renderItems () {
    const { currentTimeline, bookIds, books } = this.props
    return bookIds.map(id => {
      const book = books[`${id}`]
      return <ListItem key={id} style={styles.listItem} onPress={() => this.onChange(id)} noIndent selected={id == currentTimeline}><Text>{book.title || t('Untitled')}</Text></ListItem>
    })
  }

  render () {
    const { currentTimeline, series, books } = this.props
    const seriesText = series.name == '' ? t('Series View') : `${series.name} (${t('Series View')})`
    const selectedTitle = currentTimeline == 'series' ? seriesText : (books[currentTimeline].title || t('Untitled'))
    return <Popover
      isVisible={this.state.open}
      from={<Button bordered dark iconRight style={styles.picker} onPress={() => this.setState({open: true})}>
        <Text>{selectedTitle}</Text><Icon type='FontAwesome5' name='chevron-down' style={{fontSize: 12}}/>
      </Button>}
    >
      <List>
        <ListItem style={styles.listItem} onPress={() => this.onChange('series')} noIndent selected={currentTimeline == 'series'}><Text>{seriesText}</Text></ListItem>
        { this.renderItems() }
      </List>
    </Popover>
  }
}

const styles = StyleSheet.create({
  picker: {
    borderColor: 'hsl(211, 27%, 70%)', //gray-6
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  listItem: {
    width: 400,
  },
})

SeriesPicker.propTypes = {
  series: PropTypes.object.isRequired,
  books: PropTypes.object.isRequired,
  bookIds: PropTypes.array.isRequired,
}

function mapStateToProps (state) {
  return {
    series: state.series,
    books: state.books,
    bookIds: state.books.allIds,
    currentTimeline: selectors.currentTimelineSelector(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.uiActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesPicker)
