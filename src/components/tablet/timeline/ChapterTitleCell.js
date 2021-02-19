import React, { PureComponent } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, View } from 'react-native'
import t from 'format-message'
import prompt from 'react-native-prompt-android'
import { selectors, actions } from 'pltr/v2'
import Cell from '../shared/Cell'
import { showAlert, showInputAlert } from '../../shared/common/AlertDialog'
import { Text } from '../../shared/common'

class ChapterTitleCell extends PureComponent {

  handleNewChapterName = ({ input }) => {
    const { isSeries, actions, beatActions, chapterId } = this.props
    const newName = input || 'auto'
    if (isSeries) {
      beatActions.editBeatTitle(chapterId, newName)
    } else {
      actions.editSceneTitle(chapterId, newName)
    }
  }

  handleDeleteChapter = () => {
    setTimeout(() => {
      // delay for 1 sec
      const { chapterId, chapterTitle, bookId } = this.props
      showAlert({
        title: t('Delete Chapter'),
        message: t('Delete Chapter {name}?', { name: chapterTitle }),
        actions: [{
          chapterId,
          bookId,
          icon: 'trash',
          danger: true,
          name: t('Delete Chapter'),
          callback: this.deleteChapter
        },
        {
          name: t('Cancel')
        }]
      })
    }, 300)
  }

  deleteChapter = ({ chapterId, bookId }) => {
    const { isSeries, actions, beatActions } = this.props
    if (isSeries) {
      beatActions.deleteBeat(chapterId, bookId)
    } else {
      actions.deleteScene(chapterId, bookId)
    }
  }

  askToRename = () => {
    const { chapterTitle, chapter } = this.props
    const chapterName =  chapter.title || 'auto'
    showInputAlert({
      title: chapterTitle,
      message: t('Enter Chapter\'s name or enter'),
      inputText: chapterName,
      actions: [
        {
          name: t('Rename'),
          icon: 'pen',
          positive: true,
          callback: this.handleNewChapterName
        },
        { name: t('Cancel') },
        {
          name: t('Delete'),
          icon: 'trash',
          danger: 1,
          callback: this.handleDeleteChapter
        }
      ]
    })
  }

  render () {
    const { chapterTitle } = this.props
    // ref is needed
    return (
      <Cell style={styles.cell} ref={r => this.ref = r} onPress={this.askToRename}>
        <Text fontStyle='bold' style={styles.text}>{chapterTitle}</Text>
      </Cell>
    )
  }
}

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
  },
})

ChapterTitleCell.propTypes = {
  chapterId: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired,
  beatActions: PropTypes.object.isRequired,
  chapters: PropTypes.array.isRequired,
  chapter: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  isSeries: PropTypes.bool,
  chapterTitle: PropTypes.string.isRequired,
  positionOffset: PropTypes.number.isRequired,
}

const makeMapState = (state) => {
  const uniqueChapterSelector = selectors.makeChapterSelector()
  const uniqueChapterTitleSelector = selectors.makeChapterTitleSelector()

  return function mapStateToProps (state, ownProps) {
    return {
      chapters: state.chapters,
      chapter: uniqueChapterSelector(state, ownProps.chapterId),
      ui: state.ui,
      isSeries: selectors.isSeriesSelector(state),
      chapterTitle: uniqueChapterTitleSelector(state, ownProps.chapterId),
      positionOffset: selectors.positionOffsetSelector(state),
    }
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.sceneActions, dispatch),
    beatActions: bindActionCreators(actions.beat, dispatch),
  }
}

export default connect(
  makeMapState,
  mapDispatchToProps
)(ChapterTitleCell)
