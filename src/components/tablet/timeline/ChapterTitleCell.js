import React, { PureComponent } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Text, View } from 'react-native'
import t from 'format-message'
import prompt from 'react-native-prompt-android'
import { selectors, actions } from 'pltr/v2'
import Cell from '../shared/Cell'

class ChapterTitleCell extends PureComponent {
  rename = newValue => {
    const { isSeries, actions, beatActions, chapterId } = this.props
    if (isSeries) {
      beatActions.editBeatTitle(chapterId, newValue)
    } else {
      actions.editSceneTitle(chapterId, newValue)
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

  render () {
    const { chapterTitle } = this.props
    // ref is needed
    return <Cell style={styles.cell} ref={r => this.ref = r} onPress={this.askToRename}>
      <Text style={styles.text}>{chapterTitle}</Text>
    </Cell>
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
    beatActions: bindActionCreators(actions.beatActions, dispatch),
  }
}

export default connect(
  makeMapState,
  mapDispatchToProps
)(ChapterTitleCell)