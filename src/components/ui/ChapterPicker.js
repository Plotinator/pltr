import React, { Component } from 'react'
import { Picker, Icon } from 'native-base'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { selectors, chapterHelpers } from 'pltr/v2'
import i18n from 'format-message'

class ChapterPicker extends Component {
  renderItems () {
    const { chapters, positionOffset, isSeries } = this.props
    return chapters.map(ch => {
      return <Picker.Item label={chapterHelpers.chapterTitle(ch, positionOffset, isSeries)} value={ch.id} />
    })
  }

  render() {
    const { selectedId, onChange } = this.props
    return <Picker
      iosIcon={<Icon type='FontAwesome5' name='chevron-down' style={{fontSize: 12}}/>}
      iosHeader={selectedId ? '' : i18n('Select a Chapter')}
      placeholder={selectedId ? '' : i18n('Select a Chapter')}
      mode='dialog'
      selectedValue={selectedId}
      onValueChange={onChange}
    >
      { this.renderItems() }
    </Picker>
  }
}

ChapterPicker.propTypes = {
  chapters: PropTypes.array.isRequired,
  isSeries: PropTypes.bool.isRequired,
  positionOffset: PropTypes.number.isRequired,
  selectedId: PropTypes.number,
  onChange: PropTypes.func.isRequired,
}

function mapStateToProps (state) {
  return {
    chapters: selectors.sortedChaptersByBookSelector(state),
    isSeries: selectors.isSeriesSelector(state),
    positionOffset: selectors.positionOffsetSelector(state),
  }
}

function mapDispatchToProps (dispatch) {
  return { }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChapterPicker)