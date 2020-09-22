import { cloneDeep } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, Text, Container, Content, Form, Input, Label, Item, Button, Icon } from 'native-base'
import { selectors, actions, initialState } from 'pltr/v2'
import { StyleSheet, Modal, KeyboardAvoidingView, InputAccessoryView } from 'react-native'
import t from 'format-message'
import AttachmentList from '../../shared/attachments/AttachmentList'
import ChapterPicker from '../../ui/ChapterPicker'
import LinePicker from '../../ui/LinePicker'

// cooresponds to CardDialog in desktop

class CardModal extends Component {
  state = {}

  static getDerivedStateFromProps (props, state) {
    const { cards, card, isNewCard, chapterId } = props
    let cardObj = {}
    if (isNewCard) {
      cardObj = {...cloneDeep(initialState.card), chapterId: chapterId}
    } else {
      cardObj = state.card || cards.find(c => c.id == card.id)
    }
    return {
      isNewCard: state.isNewCard === undefined ? isNewCard : state.isNewCard,
      chapterId: chapterId,
      card: cardObj,
      changes: state.changes === undefined ? isNewCard : state.changes,
    }
  }

  saveChanges = () => {
    const { changes, isNewCard, card } = this.state
    if (!changes) return
    if (isNewCard) {
      this.props.actions.addCard({...card, lineId: 1}) // TODO: remove lineId 1
    } else {
      this.props.actions.editCard(card.id, card.title, card.description)
    }
    this.setState({isNewCard: false, changes: false})
    this.props.onClose()
  }

  changeChapter = (val) => {
    this.setState({card: {...this.state.card, chapterId: val}})
    this.props.actions.changeScene(this.state.card.id, val, this.props.bookId)
  }

  changeLine = (val) => {
    this.setState({card: {...this.state.card, lineId: val}})
    this.props.actions.changeLine(this.state.card.id, val, this.props.bookId)
  }

  navigateToAttachmentSelector = (type, selectedIds) => {
    this.props.navigation.navigate('AttachmentSelectorModal', {item: this.state.card, itemType: 'card', type, selectedIds})
  }

  renderAttachments () {
    const { card, isNewCard } = this.state
    if (isNewCard) return null

    return <AttachmentList
      itemType='card'
      item={card}
      navigate={this.props.navigation.navigate}
    />
  }

  render () {
    const { card, changes } = this.state
    return <Modal visible={true} animationType='slide' transparent={true} onDismiss={this.props.onClose} onRequestClose={this.props.onClose}>
      <View style={styles.centered} elevation={10}>
        <View style={styles.contentWrapper}>
          <View style={styles.content} >
            <Form style={styles.form}>
              <View style={styles.formLeft}>
                <Item inlineLabel last style={styles.label}>
                  <Label>{t('Title')}</Label>
                  <Input
                    value={card.title}
                    onChangeText={text => this.setState({card: {...card, title: text}, changes: true})}
                    autoCapitalize='sentences'
                  />
                </Item>
                <Item inlineLabel last regular style={[styles.label]}>
                  <Label>{t('Description')}</Label>
                </Item>
              </View>
              <View style={styles.formRight}>
                <View style={styles.formRightInner}>
                  <View>
                    <View style={styles.buttonWrapper}>
                      <Button rounded light style={styles.button} onPress={this.props.onClose}><Icon type='FontAwesome5' name='times'/></Button>
                    </View>
                    <View style={styles.formRightItems}>
                      <Item fixedLabel style={styles.label}>
                        <Label>{t('Chapter')}</Label>
                        <ChapterPicker selectedId={card.chapterId} onChange={this.changeChapter} />
                      </Item>
                      <Item fixedLabel style={styles.label}>
                        <Label>{t('Plotline')}</Label>
                        <LinePicker selectedId={card.lineId} onChange={this.changeLine} />
                      </Item>
                      { this.renderAttachments() }
                    </View>
                  </View>
                  <View style={styles.buttonFooter}>
                    <Button block success disabled={!changes} onPress={this.saveChanges}><Text>{t('Save')}</Text></Button>
                  </View>
                </View>
              </View>
            </Form>
          </View>
        </View>
      </View>
    </Modal>
  }
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  contentWrapper: {
    width: '85%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
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
  content: {
    flex: 1,
  },
  label: {
    marginBottom: 16,
  },
  afterList: {
    marginTop: 16,
  },
  form: {
    flex: 1,
    flexDirection: 'row',
  },
  formRight: {
    flex: 0.25,
    paddingLeft: 8,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'hsl(210, 36%, 96%)', //gray-9
  },
  formRightInner: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  formRightItems: {
    paddingRight: 8,
  },
  formLeft: {
    flex: 0.75,
    paddingHorizontal: 16,
  },
  badge: {
    marginRight: 8,
  }
})

CardModal.propTypes = {
  card: PropTypes.object,
  chapterId: PropTypes.number.isRequired,
  lineId: PropTypes.number.isRequired,
  closeDialog: PropTypes.func,
  lines: PropTypes.array.isRequired,
  chapters: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  isSeries: PropTypes.bool.isRequired,
  positionOffset: PropTypes.number.isRequired,
  cards: PropTypes.array.isRequired,
  bookId: PropTypes.number.isRequired,
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    chapters: selectors.sortedChaptersByBookSelector(state),
    lines: selectors.sortedLinesByBookSelector(state),
    isSeries: selectors.isSeriesSelector(state),
    positionOffset: selectors.positionOffsetSelector(state),
    cards: state.cards,
    bookId: selectors.currentTimelineSelector(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.cardActions, dispatch),
    uiActions: bindActionCreators(actions.uiActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardModal)