import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, FlatList } from 'react-native'
import { SwipeRow } from 'react-native-swipe-list-view'
import { View, Button, H3 } from 'native-base'
import t from 'format-message'
import cx from 'classnames'
import { selectors, cardHelpers, actions } from 'pltr/v2'
import ErrorBoundary from '../../shared/ErrorBoundary'
import Chapter from '../../shared/outline/Chapter'
import TrashButton from '../../ui/TrashButton'
import RenameButton from '../../ui/RenameButton'
import AddButton from '../../ui/AddButton'
import { Text } from '../../shared/common'
import styles from './OutlineStyles'
import { showAlert, showInputAlert } from '../../shared/common/AlertDialog'

class Outline extends Component {
  referrers = []

  constructor (props) {
    super(props)
    this.state = { currentLine: null }
  }

  setRowReferrer = ref_name => ref => this.referrers[ref_name] = ref
  deleteRowReferrer = ref_name => delete this.referrers[ref_name]

  renameChapter = ({ chapterId, input: chapterName }) => {
    const { isSeries, actions, beatActions } = this.props

    if (isSeries) {
      beatActions.editBeatTitle(chapterId, chapterName)
    } else {
      actions.editSceneTitle(chapterId, chapterName)
    }
  }

  deleteChapter = ({ chapterId, input: chapterName, bookId }) => {
    const { isSeries, actions, beatActions } = this.props
    if (isSeries) {
      beatActions.deleteBeat(chapterId, bookId)
    } else {
      actions.deleteScene(chapterId, bookId)
    }
    this.deleteRowReferrer(`chapter_row_${chapterId}`)
  }

  closeChapterRow({ chapterId }) {
    // per row closure
    const chapterRow = this.referrers[`chapter_row_${chapterId}`]
    if(chapterRow) chapterRow.closeRow()
  }

  handleDeleteChapter = (chapter) => {
    const { position, title, id: chapterId, bookId } = chapter
    const isAuto = title == 'auto'
    const chapterNumber = position + 1
    const autoChapter = t('Chapter {number}', { number: chapterNumber })
    const chapterName = isAuto ? autoChapter : title

    showAlert({
      title: t('Delete Chapter'),
      message: t('Delete Chapter {name}?', { name: chapterName }),
      actions: [{
        chapterId,
        bookId: bookId,
        positive: true,
        name: t('Delete Chapter'),
        callback: this.deleteChapter
      },
      {
        name: t('Cancel')
      }]
    })
    this.closeChapterRow({ chapterId })
  }

  handleRenameChapter = (chapter) => {
    const { position, title, id: chapterId } = chapter
    const chapterNumber = position + 1
    const isAuto = title == 'auto'
    const autoChapter = t('Chapter {number}', { number: chapterNumber })
    const chapterName = isAuto ? autoChapter : title

    showInputAlert({
      title: t('Rename Chapter'),
      message: t('Enter a new name for {chapter}', { chapter: chapterName }),
      inputText: chapterName,
      actions: [{
        chapterId,
        positive: true,
        name: t('Save Chapter'),
        callback: this.renameChapter
      },
      {
        name: t('Cancel')
      }]
    })
    this.closeChapterRow({ chapterId })
  }

  navigateToPlotlines = () => {
    this.props.navigation.navigate('PlotlinesModal')
  }

  renderChapterInner = (chapterTitle, cards, manualSort, navigateToNewCard, chapter) => {
    return (
      <View style={styles.swipeContainer}>
        <SwipeRow ref={this.setRowReferrer(`chapter_row_${chapter.id}`)} leftOpenValue={75} rightOpenValue={-100}>
          <View style={styles.sliderRow}>
            <TrashButton
              data={chapter}
              onPress={this.handleDeleteChapter}
              buttonStyle={styles.trashButton}/>
            <RenameButton
              data={chapter}
              onPress={this.handleRenameChapter}
              buttonStyle={styles.renameButton}
            />
          </View>
          <View style={styles.chapterView}>
            <View style={styles.title}>
              <Text fontSize='h3' fontStyle='semiBold'>
                {chapterTitle}
              </Text>
              {manualSort}
              <AddButton
                onPress={navigateToNewCard}
                iconStyle={styles.addScene}
              />
            </View>
          </View>
        </SwipeRow>
        {cards}
      </View>
    )
  }

  renderChapter (chapter, cardMap) {
    return (
      <ErrorBoundary key={chapter.id}>
        <Chapter
          chapter={chapter}
          cards={cardMap[chapter.id]}
          activeFilter={!!this.state.currentLine}
          navigation={this.props.navigation}
          render={this.renderChapterInner}
        />
      </ErrorBoundary>
    )
  }

  render () {
    const { chapters, lines, card2Dmap } = this.props
    const cardMap = cardHelpers.cardMapping(
      chapters,
      lines,
      card2Dmap,
      this.state.currentLine
    )
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={chapters}
          renderItem={({ item }) => this.renderChapter(item, cardMap)}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.content}
          style={styles.chaptersList}
        />
        <Button full info onPress={this.navigateToPlotlines}>
          <Text white>{t('Plotlines')}</Text>
        </Button>
      </View>
    )
  }
}

Outline.propTypes = {
  chapters: PropTypes.array.isRequired,
  lines: PropTypes.array.isRequired,
  card2Dmap: PropTypes.object.isRequired,
  file: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  isSeries: PropTypes.bool,
  navigation: PropTypes.object.isRequired
}

function mapStateToProps (state) {
  return {
    chapters: selectors.sortedChaptersByBookSelector(state),
    lines: selectors.sortedLinesByBookSelector(state),
    card2Dmap: selectors.cardMapSelector(state),
    file: state.file,
    ui: state.ui,
    isSeries: selectors.isSeriesSelector(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.sceneActions, dispatch),
    beatActions: bindActionCreators(actions.beatActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Outline)
