import React, { Component } from 'react'
import { Picker, Icon } from 'native-base'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { selectors } from 'pltr/v2'
import t from 'format-message'

class CategoryPicker extends Component {

  onChange = val => {
    this.props.onChange(val == -1 ? null : val)
  }

  renderItems () {
    const { categories, type } = this.props

    const allCategories = [...categories[type], {id: -1, name: t('Uncategorized')}]

    return allCategories.map(cat => {
      return <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
    })
  }

  render() {
    const { selectedId } = this.props
    let val = selectedId ? selectedId : -1
    return <Picker
      iosIcon={<Icon type='FontAwesome5' name='chevron-down' style={{fontSize: 12}}/>}
      iosHeader={t('Category')}
      placeholder={t('Select a Category')}
      mode='dialog'
      selectedValue={val}
      onValueChange={this.onChange}
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
