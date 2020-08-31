import React, { Component } from 'react'
import { Picker, Icon } from 'native-base'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { selectors } from 'pltr/v2'
import i18n from 'format-message'

class LinePicker extends Component {
  renderItems () {
    return this.props.lines.map(l => {
      return <Picker.Item label={l.title} value={l.id} />
    })
  }

  render() {
    const { selectedId, onChange } = this.props
    return <Picker
      iosIcon={<Icon type='FontAwesome5' name='chevron-down' style={{fontSize: 12}}/>}
      iosHeader={selectedId ? '' : i18n('Select a Plotline')}
      placeholder={selectedId ? '' : i18n('Select a Plotline')}
      mode='dropdown'
      selectedValue={selectedId}
      onValueChange={onChange}
    >
      { this.renderItems() }
    </Picker>
  }
}

LinePicker.propTypes = {
  lines: PropTypes.array.isRequired,
  selectedId: PropTypes.number,
  onChange: PropTypes.func.isRequired,
}

function mapStateToProps (state) {
  return {
    lines: selectors.sortedLinesByBookSelector(state),
  }
}

function mapDispatchToProps (dispatch) {
  return { }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinePicker)