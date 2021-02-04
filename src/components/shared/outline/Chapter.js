import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { sortBy } from 'lodash'
import t from 'format-message'
import cx from 'classnames'
import { selectors, actions, cardHelpers, listHelpers, chapterHelpers } from 'pltr/v2'
import { H3, Icon, Card, CardItem, View } from 'native-base'
import { SwipeRow } from 'react-native-swipe-list-view'
import SceneCard from './SceneCard'
import { StyleSheet } from 'react-native'
import { Text, ShellButton } from '../common'
import Metrics from '../../../utils/Metrics'
import Colors from '../../../utils/Colors'
import Fonts from '../../../fonts'

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

  reorderCards = ({current, currentIndex, dropped}) => {
    const { sortedCards } = this.state
    const { isSeries, chapter, actions } = this.props
    const currentIds = sortedCards.map(c => c.id)
    const currentLineId = isSeries ? current.seriesLineId : current.lineId
    let newOrderInChapter = []
    let newOrderWithinLine = null

    // already in chapter
    if (currentIds.includes(dropped.cardId)) {
      // flip it to manual sort
      newOrderInChapter = listHelpers.moveToAbove(dropped.index, currentIndex, currentIds)
      if (dropped.lineId == currentLineId) {
        // if same line, also update positionWithinLine
        const cardIdsInLine = sortedCards.filter(c => isSeries ? c.seriesLineId == currentLineId : c.lineId == currentLineId).map(c => c.id)
        const currentPosition = sortedCards.find(c => c.id == dropped.cardId).positionWithinLine
        newOrderWithinLine = listHelpers.moveToAbove(currentPosition, current.positionWithinLine, cardIdsInLine)
      }
      actions.reorderCardsInChapter(chapter.id, currentLineId, isSeries, newOrderInChapter, newOrderWithinLine)
    } else {
      // dropped in from a different chapter
      if (dropped.lineId == currentLineId) {
        // if same line, can just update positionWithinLine
        let cardIdsWithinLine = sortedCards.filter(c => isSeries ? c.seriesLineId == currentLineId : c.lineId == currentLineId).map(c => c.id)
        cardIdsWithinLine.splice(current.positionWithinLine, 0, dropped.cardId)
        actions.reorderCardsWithinLine(chapter.id, currentLineId, isSeries, cardIdsWithinLine)
      } else {
        // flip to manual sort
        newOrderInChapter = currentIds
        newOrderInChapter.splice(currentIndex, 0, dropped.cardId)
        actions.reorderCardsInChapter(chapter.id, currentLineId, isSeries, newOrderInChapter, null, dropped.cardId)
      }
    }
  }

  renderManualSort () {
    if (this.props.chapter.autoOutlineSort) return null
    return (
      <ShellButton
        onPress={this.autoSortChapter}
        style={styles.manualSorted}>
        <Text fontStyle='semiBold' fontSize='small' white>
          {t('Manually Sorted')}
        </Text>
        <Icon type='FontAwesome5' name='times' style={styles.closeIcon} />
      </ShellButton>
    )
  }

  renderCards () {
    const { sortedCards } = this.state
    const hasCards = sortedCards.length
    return hasCards == 0 ? null : (
      <View style={styles.cardsContainer}>
        {sortedCards.map((c, idx) => {
          return (
            <SceneCard key={c.id} card={c} index={idx} reorder={this.reorderCards} navigation={this.props.navigation}/>
          )
        })}
      </View>
    )
  }

  render () {
    const { chapter, cards, activeFilter, positionOffset, isSeries } = this.props
    if (activeFilter && !cards.length) return null

    const chapterTitle = chapterHelpers.chapterTitle(chapter, positionOffset, isSeries)
    const renderedCards = this.renderCards()
    const manualSort = this.renderManualSort()
    return this.props.render(chapterTitle, renderedCards, manualSort, this.navigateToNewCard, chapter)
  }
}

const styles = StyleSheet.create({
  cardsContainer: {
    backgroundColor: Colors.cloud,
    paddingTop: Metrics.baseMargin,
  },
  chapterView: {
    backgroundColor: 'white',
    padding: 8,
  },
  sliderRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addScene: {
    fontSize: 16,
  },
  manualSorted: {
    padding: Metrics.baseMargin,
    paddingVertical: Metrics.baseMargin / 2,
    borderRadius: Metrics.buttonRadius,
    backgroundColor: Colors.orange,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeIcon: {
    marginLeft: Metrics.baseMargin / 2,
    fontSize: Fonts.size.small,
    color: Colors.white
  }
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
  render: PropTypes.func.isRequired,
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
    actions: bindActionCreators(actions.cardActions, dispatch),
    chapterActions: bindActionCreators(actions.sceneActions, dispatch),
    beatActions: bindActionCreators(actions.beatActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chapter)
