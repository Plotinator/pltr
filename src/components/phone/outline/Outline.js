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
  constructor (props) {
    super(props)
    this.state = { currentLine: null }
  }

  rename = newValue => {
    const { isSeries, actions, beatActions, chapterId } = this.props
    if (isSeries) {
      beatActions.editBeatTitle(chapterId, newValue)
    } else {
      // actions.editSceneTitle(chapterId, newValue)
    }
  }

  askToRename = () => {
    const { chapterTitle, chapter } = this.props
    // t('(Current title: {chapterName})', {chapterName: chapter.title})
    prompt(t('Rename {chapterName}', {chapterName: chapterTitle}), null,
      [
        {text: t('Cancel'), style: 'cancel'},
        {text: t('OK'), onPress: this.rename},
      ],
      {
        type: 'plain-text',
        cancelable: false,
        defaultValue: chapter.title,
      }
    )
  }

  deleteChapter = ({ data }) => {
    console.log('CHAPTER', data)
  }

  renameChapter = ({ input, data }) => {
    console.log('CHAPTER', data)
  }

  handleDeleteChapter = (chapter) => {
    const { id, title } = chapter
    const isAuto = title == 'auto'
    const autoChapter = t('Chapter {count}', { count: id})
    const chapterName = isAuto ? autoChapter : title

    showAlert(
      t('Delete Chapter?'),
      t('Delete Chapter {name}?', { name: chapterName }),
      [{
        positive: true,
        name: t('Delete Chapter'),
        callback: this.deleteChapter,
        data: chapter
      },
      {
        name: t('Cancel')
      }]
    )
  }

  handleRenameChapter = (chapter) => {
    const { id, title } = chapter
    const isAuto = title == 'auto'
    const autoChapter = t('Chapter {count}', { count: id})
    const chapterName = isAuto ? autoChapter : title

    showInputAlert(
      t('Rename Chapter'),
      t('Enter new name'),
      [{
        name: t('Save Chapter'),
        callback: this.handleRenameChapter,
        positive: true
      },
      {
        name: t('Cancel')
      }]
    )
  }

  navigateToPlotlines = () => {
    this.props.navigation.navigate('PlotlinesModal')
  }

  renderChapterInner = (chapterTitle, cards, manualSort, navigateToNewCard, chapter) => {
    return (
      <View style={styles.swipeContainer}>
        <SwipeRow leftOpenValue={75} rightOpenValue={-100}>
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
    beatActions: bindActionCreators(actions.beatActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Outline)
