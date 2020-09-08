import React, { Component } from 'react'
import { Picker, Icon } from 'native-base'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { selectors } from 'pltr/v2'
import t from 'format-message'

class CategoryPicker extends Component {
  renderItems () {
    const { categories, type } = this.props

    return categories[type].map(cat => {
      return <Picker.Item label={cat.name} value={cat.id} />
    })
  }

  render() {
    const { selectedId, onChange } = this.props
    return <Picker
      iosIcon={<Icon type='FontAwesome5' name='chevron-down' style={{fontSize: 12}}/>}
      iosHeader={selectedId ? '' : t('Select a Category')}
      placeholder={selectedId ? '' : t('Select a Category')}
      mode='dialog'
      selectedValue={selectedId}
      onValueChange={onChange}
    >
      { this.renderItems() }
    </Picker>
  }
}

CategoryPicker.propTypes = {
  categories: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  selectedId: PropTypes.number,
  onChange: PropTypes.func.isRequired,
}

function mapStateToProps (state) {
  return {
    categories: state.categories,
  }
}

function mapDispatchToProps (dispatch) {
  return { }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryPicker)
