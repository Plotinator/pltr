import React, { PureComponent } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Text, View } from 'react-native'
import { selectors, actions } from 'pltr/v2'
import Cell from '../shared/Cell'

class ChapterTitleCell extends PureComponent {
  render () {
    const { chapterTitle } = this.props
    return <Cell style={styles.cell}>
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
    fontWeight: 'bold',
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
