import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { sortBy } from 'lodash'
import t from 'format-message'
import cx from 'classnames'
import { selectors, actions, cardHelpers, listHelpers, chapterHelpers } from 'pltr/v2'
import { H3, Icon, Card, CardItem, View, Button, Text } from 'native-base'
import { StyleSheet } from 'react-native'
import Cell from '../shared/Cell'

class Chapter extends Component {

  state = {sortedCards: []}

  static getDerivedStateFromProps (nextProps, nextState) {
    const { chapter, cards, lines, isSeries } = nextProps
    const sortedCards = cardHelpers.sortCardsInChapter(chapter.autoOutlineSort, cards, lines, isSeries)
    return {sortedCards}
  }

  navigateToNewCard = () => {
    this.props.navigation.push('SceneDetails', {isNewCard: true, chapterId: this.props.chapter.id})
  }

  autoSortChapter = () => {
    const { chapterActions, beatActions, chapter, isSeries } = this.props
    if (isSeries) {
      beatActions.autoSortBeat(chapter.id)
    } else {
      chapterActions.autoSortChapter(chapter.id)
    }
  }

  renderSceneCard = (value) => {
    return <Cell key={value} style={styles.cell}>
      <Text style={styles.text}>{value}</Text>
    </Cell>
  }

  renderCards () {
    return this.state.sortedCards.map(c => this.renderSceneCard(c.title))
  }

  render () {
    const { chapter, ui, cards, activeFilter, positionOffset, isSeries } = this.props
    if (activeFilter && !cards.length) return null

    const klasses = cx('outline__scene-title', {darkmode: ui.darkMode})
    return <View style={styles.column}>{ this.renderCards() }</View>
  }
}

const styles = StyleSheet.create({
  column: { flexDirection: "column" },
  cell: {
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
})

Chapter.propTypes = {
  chapter: PropTypes.object.isRequired,
  cards: PropTypes.array.isRequired,
  activeFilter: PropTypes.bool.isRequired,
  ui: PropTypes.object.isRequired,
  lines: PropTypes.array.isRequired,
  isSeries: PropTypes.bool.isRequired,
  positionOffset: PropTypes.number.isRequired,
  navigation: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    ui: state.ui,
    lines: selectors.sortedLinesByBookSelector(state),
    isSeries: selectors.isSeriesSelector(state),
    positionOffset: selectors.positionOffsetSelector(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.card, dispatch),
    chapterActions: bindActionCreators(actions.sceneActions, dispatch),
    beatActions: bindActionCreators(actions.beat, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chapter)
