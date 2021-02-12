import React, { PureComponent } from 'react'
import PropTypes from 'react-proptypes'
import { StyleSheet } from 'react-native'
import Cell from '../shared/Cell'
import { LEFT_COLUMN_WIDTH } from '../../../utils/constants'
import { Text, Button, Input } from '../../shared/common'

export default class LineTitleCell extends PureComponent {
  handleEdit = () => {
    const { editPlotLine, line } = this.props
    editPlotLine(line)
  }

  render () {
    const { line } = this.props
    return (
      <Cell
        style={styles.lineTitleCell}
        onPress={this.handleEdit}>
        <Text fontStyle='bold' style={styles.lineTitle}>
          {line.title}
        </Text>
      </Cell>
    )
  }
}

const styles = StyleSheet.create({
  lineTitleCell: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    width: LEFT_COLUMN_WIDTH
  },
  lineTitle: {
    fontSize: 18
  }
})

LineTitleCell.propTypes = {
  line: PropTypes.object.isRequired
}
