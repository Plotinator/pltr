import React, { PureComponent } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, Text, Input, Label, Item, Button, Icon, H3 } from 'native-base'
import { StyleSheet, Modal } from 'react-native'
import { selectors, actions } from 'pltr/v2'
import t from 'format-message'
import Cell from '../shared/Cell'
import { LEFT_COLUMN_WIDTH } from '../../../utils/constants'
import { DetailsWrapper, DetailsRight, DetailsLeft } from '../shared/Details'
import tinycolor from 'tinycolor2'
import ColorPickerModal from '../shared/ColorPickerModal'

class LineTitleCell extends PureComponent {
  state = {showModal: false, showColorPicker: false, title: '', color: '', changes: false}

  closeModal = () => {
    this.setState({showModal: false})
  }

  saveChanges = () => {
    const { changes, title, color } = this.state
    if (!changes) return null
    if (!title && !color) return null

    const { line, actions } = this.props
    const newTitle = title || line.title
    const newColor = color || line.color
    actions.editLine(line.id, newTitle, newColor)

    this.setState({showModal: false})
  }

  renderColorPicker () {
    if (!this.state.showColorPicker) return null

    console.log('renderColorPicker', this.state.showColorPicker)

    return <ColorPickerModal
      chooseColor={color => this.setState({color, showColorPicker: false, showModal: true, changes: true})}
      currentColor={this.state.color || this.props.line.color}
      onClose={() => this.setState({showColorPicker: false, showModal: true})}
    />
  }

  renderModal () {
    if (!this.state.showModal) return null

    const { line } = this.props
    const colorObj = tinycolor(this.state.color || line.color)
    const backgroundColor = {backgroundColor: colorObj.toHexString()}

    const inputTitleVal = this.state.title || line.title
    const inputColorVal = this.state.color || line.color

    return <Modal visible={true} animationType='slide' transparent={true} onDismiss={this.closeModal} onRequestClose={this.closeModal}>
      <View style={styles.centered} elevation={10}>
        <View style={styles.contentWrapper}>
          <DetailsWrapper>
            <DetailsLeft contentContainerStyle={{flex: 1}}>
              <Item inlineLabel last style={styles.label}>
                <Label>{t('Title')}</Label>
                <Input
                  value={inputTitleVal}
                  onChangeText={text => this.setState({title: text, changes: true})}
                  autoCapitalize='sentences'
                />
              </Item>
              <Item inlineLabel last style={styles.label}>
                <Label>{t('Color')}</Label>
                <Input
                  value={inputColorVal}
                  onChangeText={text => this.setState({color: text, changes: true})}
                />
              </Item>
              <View style={styles.colorWrapper}>
                <H3>{t('Current Color')}</H3>
                <View style={[styles.colorSwatch, backgroundColor]} />
                <Button bordered light style={styles.colorButton} onPress={() => this.setState({showColorPicker: true, showModal: false})}><Text style={styles.colorButtonText}>{t('Choose Color')}</Text></Button>
              </View>
            </DetailsLeft>
            <DetailsRight>
              <View>
                <View style={styles.buttonWrapper}>
                  <Button rounded light style={styles.button} onPress={this.closeModal}><Icon type='FontAwesome5' name='times'/></Button>
                </View>
                <View style={styles.formRightItems}>
                </View>
              </View>
              <View style={styles.buttonFooter}>
                <Button block success disabled={!this.state.changes} onPress={this.saveChanges}><Text>{t('Save')}</Text></Button>
              </View>
            </DetailsRight>
          </DetailsWrapper>
        </View>
      </View>
    </Modal>
  }

  render () {
    console.log('state', this.state)
    const { line } = this.props
    return <Cell style={styles.lineTitleCell} onPress={() => this.setState({showModal: true})}>
      <Text style={styles.lineTitle}>{line.title}</Text>
      { this.renderModal() }
      { this.renderColorPicker() }
    </Cell>
  }
}

const styles = StyleSheet.create({
  lineTitleCell: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    width: LEFT_COLUMN_WIDTH,
  },
  lineTitle: {
    fontSize: 18,
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  contentWrapper: {
    width: '50%',
    height: '50%',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  buttonFooter: {
    marginTop: 16,
    marginRight: 16,
    marginBottom: 8,
  },
  button: {
    // backgroundColor: '#f4f4f4',
    backgroundColor: 'white',
    borderColor: '#f4f4f4',
  },
  label: {
    marginBottom: 16,
  },
  currentColor: {
    height: 50,
    width: 50,
  },
  colorWrapper: {
    marginTop: 8,
    alignItems: 'center',
  },
  colorSwatch: {
    width: 60,
    height: 50,
    margin: 8,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  colorButton: {
    alignSelf: 'center',
    marginTop: 16,
  },
  colorButtonText: {
    color: 'black',
  }
})

LineTitleCell.propTypes = {
  line: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.lineActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LineTitleCell)
