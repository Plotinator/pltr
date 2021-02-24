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

  handleNewBeatName = ({ input }) => {
    const { actions, beatActions, beatId } = this.props
    const newName = input || 'auto'
    actions.editBeatTitle(beatId, newName)
  }

  handleDeleteBeat = () => {
    setTimeout(() => {
      // delay for 1 sec
      const { beatId, beatTitle, bookId } = this.props
      showAlert({
        title: t('Delete Chapter'),
        message: t('Delete Chapter {name}?', { name: beatTitle }),
        actions: [{
          beatId,
          bookId,
          icon: 'trash',
          danger: true,
          name: t('Delete Chapter'),
          callback: this.deleteBeat
        },
        {
          name: t('Cancel')
        }]
      })
    }, 300)
  }

  deleteBeat = ({ beatId, bookId }) => {
    const { actions, beatActions } = this.props
    actions.deleteBeat(beatId, bookId)
  }

  askToRename = () => {
    const { beatTitle, beat } = this.props
    const beatName =  beat.title || 'auto'
    showInputAlert({
      title: beatTitle,
      message: t('Enter Chapter\'s name or enter'),
      inputText: beatName,
      actions: [
        {
          name: t('Rename'),
          icon: 'pen',
          positive: true,
          callback: this.handleNewBeatName
        },
        { name: t('Cancel') },
        {
          name: t('Delete'),
          icon: 'trash',
          danger: 1,
          callback: this.handleDeleteBeat
        }
      ]
    })
  }

  render () {
    const { beatTitle } = this.props
    // ref is needed
    return (
      <Cell style={styles.cell} ref={r => this.ref = r} onPress={this.askToRename}>
        <Text fontStyle='bold' style={styles.text}>{beatTitle}</Text>
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
  beatId: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  beatTitle: PropTypes.string.isRequired,
  positionOffset: PropTypes.number.isRequired,
}

const makeMapState = (state) => {
  const uniqueBeatSelector = selectors.makeBeatSelector()
  const uniqueBeatTitleSelector = selectors.makeBeatTitleSelector()

  return function mapStateToProps (state, ownProps) {
    return {
      beat: uniqueBeatSelector(state, ownProps.beatId),
      ui: state.ui,
      beatTitle: uniqueBeatTitleSelector(state, ownProps.beatId),
      positionOffset: selectors.positionOffsetSelector(state),
    }
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.beat, dispatch)
  }
}

export default connect(
  makeMapState,
  mapDispatchToProps
)(ChapterTitleCell)
