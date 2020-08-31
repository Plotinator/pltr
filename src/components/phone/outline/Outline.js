import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { ScrollView, StyleSheet, FlatList } from 'react-native'
import i18n from 'format-message'
import cx from 'classnames'
import { selectors, cardHelpers } from 'pltr/v2'
import { View, Text, Content, Container, Card } from 'native-base'
import ErrorBoundary from '../../ErrorBoundary'
import Chapter from './Chapter'

class Outline extends Component {
  constructor (props) {
    super(props)
    this.state = {currentLine: null}
  }

  filterItem = (id) => {
    if (this.state.currentLine === id) {
      this.setState({currentLine: null})
    } else {
      this.setState({currentLine: id})
    }
  }

  removeFilter = () => {
    this.setState({currentLine: null})
  }

  // ///////////////
  //  rendering   //
  // //////////////

  // renderFilterList () {
  //   var items = this.props.lines.map((i) => {
  //     return this.renderFilterItem(i)
  //   })
  //   return (
  //     <ul className='filter-list__list'>
  //       {items}
  //     </ul>
  //   )
  // }

  // renderFilterItem (item) {
  //   var placeholder = <span className='filter-list__placeholder'></span>
  //   if (this.state.currentLine === item.id) {
  //     placeholder = <Glyphicon glyph='eye-open' />
  //   }
  //   return (<li key={item.id} onMouseDown={() => this.filterItem(item.id)}>
  //       {placeholder}{" "}{item.title}
  //     </li>
  //   )
  // }

  renderChapter (chapter, cardMap) {
    return <ErrorBoundary key={chapter.id}>
      <Chapter chapter={chapter} cards={cardMap[chapter.id]} activeFilter={!!this.state.currentLine} navigation={this.props.navigation} />
    </ErrorBoundary>
  }

  render () {
    const { chapters, lines, card2Dmap } = this.props
    const cardMap = cardHelpers.cardMapping(chapters, lines, card2Dmap, this.state.currentLine)
    return <FlatList
      data={chapters}
      renderItem={({item}) => this.renderChapter(item, cardMap)}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.content}
    />
  }
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
})

Outline.propTypes = {
  chapters: PropTypes.array.isRequired,
  lines: PropTypes.array.isRequired,
  card2Dmap: PropTypes.object.isRequired,
  file: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  isSeries: PropTypes.bool,
  navigation: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    chapters: selectors.sortedChaptersByBookSelector(state),
    lines: selectors.sortedLinesByBookSelector(state),
    card2Dmap: selectors.cardMapSelector(state),
    file: state.file,
    ui: state.ui,
    isSeries: selectors.isSeriesSelector(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Outline)
