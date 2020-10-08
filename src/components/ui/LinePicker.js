import React, { Component } from 'react'
import { Picker, Icon, Text, List, ListItem, Button } from 'native-base'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { isTablet } from 'react-native-device-info'
import { selectors } from 'pltr/v2'
import t from 'format-message'
import Popover from 'react-native-popover-view'

class LinePicker extends Component {
  renderTablet () {
    const { selectedId, lines } = this.props
    const selected = lines.find(l => l.id == selectedId)
    return <Popover
      from={<Button bordered dark iconRight style={styles.picker}><Text>{selected ? selected.title : t('Select a Plotline')}</Text><Icon type='FontAwesome5' name='chevron-down' style={{fontSize: 12}}/></Button>}
    >
      <List>
        { this.renderTabletItems() }
      </List>
    </Popover>
  }

  renderTabletItems () {
    const { lines, onChange, selectedId } = this.props
    return lines.map(l => {
      return <ListItem key={l.id} style={styles.listItem} onPress={() => onChange(l.id)} noIndent selected={l.id == selectedId}><Text>{l.title}</Text></ListItem>
    })
  }

  renderPhoneItems () {
    return this.props.lines.map(l => {
      return <Picker.Item key={l.id} label={l.title} value={l.id} />
    })
  }

  renderPhone () {
    const { selectedId, onChange } = this.props
    return <Picker
      iosIcon={<Icon type='FontAwesome5' name='chevron-down' style={{fontSize: 12}}/>}
      iosHeader={selectedId ? '' : t('Select a Plotline')}
      placeholder={selectedId ? '' : t('Select a Plotline')}
      mode='dropdown'
      selectedValue={selectedId}
      onValueChange={onChange}
    >
      { this.renderPhoneItems() }
    </Picker>
  }

  render () {
    if (isTablet()) {
      return this.renderTablet()
    } else {
      return this.renderPhone()
    }
  }
}

const styles = StyleSheet.create({
  picker: {
    backgroundColor: 'white',
  },
  listItem: {
    width: 200,
  },
})

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
