import { cloneDeep } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, Content, Form, Input, Label, Item, View, Toast } from 'native-base'
import { selectors, actions, initialState } from 'pltr/v2'
import { StyleSheet, Platform } from 'react-native'
import t from 'format-message'
import ChapterPicker from '../../ui/ChapterPicker'
import LinePicker from '../../ui/LinePicker'
import SaveButton from '../../ui/SaveButton'
import AttachmentList from '../../shared/attachments/AttachmentList'
import RichTextEditor from '../../shared/RichTextEditor'
import DetailsScrollView from '../shared/DetailsScrollView'

// cooresponds to CardDialog in desktop

class SceneDetails extends Component {
  state = {}

  static getDerivedStateFromProps (props, state) {
    const { route, cards } = props
    const { isNewCard, card, chapterId } = route.params
    let cardObj = {}
    if (isNewCard) {
      cardObj = state.card || {...cloneDeep(initialState.card), chapterId: chapterId}
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

  componentDidMount () {
    this.setSaveButton()
  }

  componentDidUpdate () {
    this.setSaveButton()
  }

  setSaveButton = () => {
    this.props.navigation.setOptions({
      headerRight: () => <SaveButton changes={this.state.changes} onPress={this.saveChanges} />
    })
  }

  plotlineError = () => {
    Toast.show({
      text: t('Please choose a plotline'),
      duration: 3000,
      type: 'danger',
    })
  }

  saveChanges = () => {
    const { isSeries } = this.props
    const { changes, isNewCard, card } = this.state
    if (!changes) return
    if (isNewCard) {
      if (isSeries) {
        if (!card.seriesLineId) {
          return this.plotlineError()
        }
      } else {
        if (!card.lineId) {
          return this.plotlineError()
        }
      }
      this.props.actions.addCard({...card})
      this.props.navigation.setParams({isNewCard: false})
    } else {
      this.props.actions.editCard(card.id, card.title, card.description)
    }
    this.setState({isNewCard: false, changes: false})
  }

  changeChapter = (val) => {
    const { isSeries } = this.props
    const { card } = this.state
    if (isSeries) {
      this.setState({card: {...card, beatId: val}})
    } else {
      this.setState({card: {...card, chapterId: val}})
    }
    this.props.actions.changeScene(card.id, val, this.props.bookId)
  }

  changeLine = (val) => {
    const { isSeries } = this.props
    const { card } = this.state
    if (isSeries) {
      this.setState({card: {...card, seriesLineId: val}})
    } else {
      this.setState({card: {...card, lineId: val}})
    }
    this.props.actions.changeLine(card.id, val, this.props.bookId)
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
    const { isSeries } = this.props
    const { card } = this.state
    const chapterId = isSeries ? card.beatId : card.chapterId
    const lineId = isSeries ? card.seriesLineId : card.lineId
    return <DetailsScrollView>
      <Item inlineLabel last regular style={styles.label}>
        <Label>{t('Title')}</Label>
        <Input
          value={card.title}
          onChangeText={text => this.setState({card: {...card, title: text}, changes: true})}
          autoCapitalize='sentences'
        />
      </Item>
      <Item fixedLabel style={styles.label}>
        <Label>{t('Chapter')}</Label>
        <ChapterPicker selectedId={chapterId} onChange={this.changeChapter} />
      </Item>
      <Item fixedLabel style={styles.label}>
        <Label>{t('Plotline')}</Label>
        <LinePicker selectedId={lineId} onChange={this.changeLine} />
      </Item>
      { this.renderAttachments() }
      <View style={[styles.afterList, styles.rceView]}>
        <Label>{t('Description')}</Label>
        <RichTextEditor
          initialValue={card.description}
          onChange={val => this.setState({card: {...card, description: val}, changes: true}) }
          maxHeight={5000}
        />
      </View>
    </DetailsScrollView>
  }
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 16,
  },
  afterList: {
    marginTop: 16,
  },
  badge: {
    marginRight: 8,
  },
  rceView: {
    flex: 1,
  },
})

SceneDetails.propTypes = {
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
)(SceneDetails)