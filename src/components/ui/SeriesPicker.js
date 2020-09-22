import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet } from 'react-native'
import t from 'format-message'
import { selectors, actions } from 'pltr/v2'
import { Icon, Picker } from 'native-base'

class SeriesPicker extends Component {

  onChange = (val) => {
    this.props.actions.changeCurrentTimeline(val)
  }



  renderItems () {
    const { bookIds, books } = this.props
    return bookIds.map(id => {
      const book = books[`${id}`]
      return <Picker.Item key={book.id} label={book.title || t('Untitled')} value={id} />
    })
  }

  render() {
    const { currentTimeline, series, books } = this.props
    const seriesText = series.name == '' ? t('Series View') : `${series.name} (${t('Series View')})`
    const selectedTitle = currentTimeline == 'series' ? seriesText : (books[currentTimeline].title || t('Untitled'))
    return <Picker
      iosIcon={<Icon type='FontAwesome5' name='chevron-down' style={{fontSize: 12}}/>}
      mode='modal'
      iosHeader={selectedTitle}
      placeholder={selectedTitle}
      selectedValue={currentTimeline}
      onValueChange={this.onChange}
      style={styles.picker}
    >
      <Picker.Item label={seriesText} value='series' />
      { this.renderItems() }
    </Picker>
  }
}

const styles = StyleSheet.create({
  picker: {
    borderColor: 'hsl(211, 27%, 70%)', //gray-6
    borderWidth: 1,
    backgroundColor: 'white',
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
