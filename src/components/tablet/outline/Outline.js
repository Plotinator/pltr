import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { StyleSheet, FlatList } from 'react-native'
import { keyBy } from 'lodash'
import t from 'format-message'
import cx from 'classnames'
import { selectors, cardHelpers } from 'pltr/v2'
import { View, Text, Button } from 'native-base'
import ErrorBoundary from '../../ErrorBoundary'
import Toolbar from '../../ui/Toolbar'
import SeriesPicker from '../../ui/SeriesPicker'
import MiniChapter from './MiniChapter'

class Outline extends Component {
  state = {linesById: {}, currentLine: null}

  static getDerivedStateFromProps (props, state) {
    return {
      linesById: keyBy(props.lines, 'id'),
      currentLine: state.currentLine
    }
  }

  navigateToPlotlines = () => {
  }

  renderCardDots () {
    return sortedCards.map((c) => {
      let line = findCard(c)
      if (!line) return null

      let style = {backgroundColor: line.color}
      return <div key={`dot-${line.id}-${c.id}`} title={line.title} style={style} className='outline__minimap__card-dot'></div>
    })
  }

  renderMiniChapter (chapter, index, cardMap) {
    const { isSeries, positionOffset, lines } = this.props

    return <MiniChapter key={`minimap-chapter-${chapter.id}`}
      chapter={chapter} idx={index + positionOffset} cards={cardMap[chapter.id]} linesById={this.state.linesById}
      isSeries={isSeries} sortedLines={lines} positionOffset={positionOffset}
    />
  }

  renderChapterList (cardMap) {
    const { chapters } = this.props
    return <FlatList
      data={chapters}
      renderItem={({item, index}) => this.renderMiniChapter(item, index, cardMap)}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.chapterList}
    />
  }

  renderOutlineChapter (chapter, cardMap) {
    // <Chapter chapter={chapter} cards={cardMap[chapter.id]} activeFilter={!!this.state.currentLine} navigation={this.props.navigation} />
    return <ErrorBoundary key={chapter.id}>
      <Text>Chapter</Text>
    </ErrorBoundary>
  }

  renderOutline (cardMap) {
    const { chapters } = this.props
    return <FlatList
      data={chapters}
      renderItem={({item}) => this.renderOutlineChapter(item, cardMap)}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.outline}
    />
  }

  render () {
    const { chapters, lines, card2Dmap } = this.props
    const cardMap = cardHelpers.cardMapping(chapters, lines, card2Dmap, this.state.currentLine)
    return <View style={{flex: 1}}>
      <Toolbar>
        <SeriesPicker />
      </Toolbar>
      <View style={styles.body}>
        { this.renderChapterList(cardMap) }
        { this.renderOutline(cardMap) }
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  chapterList: {
    width: '35%',
    flex: 1,
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
  outline: {
    flex: 1,
    width: '75%',
  },
  content: {
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
  positionOffset: PropTypes.number.isRequired,
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
    positionOffset: selectors.positionOffsetSelector(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Outline)
