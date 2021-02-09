import { cloneDeep } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Icon, Label, Item, View } from 'native-base'
import { selectors, actions, initialState } from 'pltr/v2'
import { StyleSheet, Platform } from 'react-native'
import t from 'format-message'
import ChapterPicker from '../../ui/ChapterPicker'
import LinePicker from '../../ui/LinePicker'
import SaveButton from '../../ui/SaveButton'
import AttachmentList from '../../shared/attachments/AttachmentList'
import DetailsScrollView from '../shared/DetailsScrollView'
import Colors from '../../../utils/Colors'
import Metrics from '../../../utils/Metrics'
import { Text, Input, RichEditor } from '../../shared/common'
import RichTextEditor from '../../shared/RichTextEditor'
import Fonts from '../../../fonts'
import {
  checkForChanges,
  addLeaveListener,
  removeLeaveListener
} from '../../../utils/Changes'
import { showAlert } from '../../shared/common/AlertDialog'

// cooresponds to CardDialog in desktop

class SceneDetails extends Component {
  state = {}

  static getDerivedStateFromProps (props, state) {
    const { route, cards } = props
    const { isNewCard, card, chapterId } = route.params
    let cardObj = {}
    if (isNewCard) {
      // TODO: confirm description override as well as
      // the new text rich editor with HTML text
      cardObj = state.card || {
        ...cloneDeep(initialState.card),
        description: '',
        chapterId: chapterId
      }
    } else {
      cardObj = state.card || cards.find((c) => c.id == card.id)
    }
    return {
      isNewCard: state.isNewCard === undefined ? isNewCard : state.isNewCard,
      chapterId: chapterId,
      card: cardObj,
      changes: state.changes === undefined ? isNewCard : state.changes
    }
  }

  componentDidMount () {
    this.setSaveButton()
    const { navigation } = this.props
    addLeaveListener(navigation, this.checkChanges)
  }

  componentWillUnmount () {
    removeLeaveListener(this.props.navigation, this.checkChanges)
  }

  componentDidUpdate () {
    this.setSaveButton()
  }

  checkChanges = (event) => {
    const { changes } = this.state
    const { navigation } = this.props
    checkForChanges(event, changes, this.saveChanges, navigation)
  }

  setSaveButton = () => {
    this.props.navigation.setOptions({
      headerRight: () => (
        <SaveButton changes={this.state.changes} onPress={this.saveChanges} />
      )
    })
  }

  plotlineError = () => {
    this.toastError(t('Please choose a plotline'))
  }

  toastError (errorText) {
    showAlert({
      message: errorText
    })
  }

  saveChanges = () => {
    const { isSeries } = this.props
    const { changes, isNewCard, card } = this.state
    if (!changes) return
    if (!card.title) return this.toastError(t('Give your scene a title'))
    console.log('CARD', card)
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
      this.props.actions.addCard({ ...card })
      this.props.navigation.setParams({ isNewCard: false })
    } else {
      this.props.actions.editCard(card.id, card.title, card.description)
    }
    this.setState({ isNewCard: false, changes: false })
  }

  changeChapter = (val) => {
    const { isSeries } = this.props
    const { card } = this.state
    if (isSeries) {
      this.setState({ card: { ...card, beatId: val } })
    } else {
      this.setState({ card: { ...card, chapterId: val } })
    }
    this.props.actions.changeScene(card.id, val, this.props.bookId)
  }

  changeLine = (val) => {
    const { isSeries } = this.props
    const { card } = this.state
    if (isSeries) {
      this.setState({ card: { ...card, seriesLineId: val } })
    } else {
      this.setState({ card: { ...card, lineId: val } })
    }
    this.props.actions.changeLine(card.id, val, this.props.bookId)
  }

  navigateToAttachmentSelector = (type, selectedIds) => {
    this.props.navigation.navigate('AttachmentSelectorModal', {
      item: this.state.card,
      itemType: 'card',
      type,
      selectedIds
    })
  }

  setScroller = (ref) => (this.detailsScroller = ref)

  handleDescriptionChange = (description) => {
    const { card } = this.state
    console.log('description', description)
    this.setState({ card: { ...card, description }, changes: true })
  }

  handleTitleChange = (title) => {
    const { card } = this.state
    this.setState({ card: { ...card, title }, changes: true })
  }

  handleOnEditorFocus = () =>
    this.detailsScroller && this.detailsScroller.getScroller().scrollToEnd()

  renderAttachments () {
    const { card, isNewCard } = this.state
    if (isNewCard) return null

    return (
      <AttachmentList
        itemType='card'
        item={card}
        navigate={this.props.navigation.navigate}
      />
    )
  }

  render () {
    const { isSeries } = this.props
    const {
      card,
      card: { title, description }
    } = this.state
    const chapterId = (isSeries ? card.beatId : card.chapterId) || ''
    const lineId = (isSeries ? card.seriesLineId : card.lineId) || ''
    return (
      <DetailsScrollView ref={this.setScroller}>
        <View style={styles.container}>
          <View inlineLabel last style={styles.label}>
            <Input
              inset
              label={`${t('Title')}:`}
              value={title}
              onChangeText={this.handleTitleChange}
              autoCapitalize='sentences'
              placeholder={t('Give your scene a title')}
              placeholderTextColor={Colors.lightGray}
            />
          </View>
          <Item fixedLabel style={styles.label}>
            <Text style={styles.labelText}>{t('Chapter')}:</Text>
            <ChapterPicker
              selectedId={chapterId}
              onChange={this.changeChapter}
            />
          </Item>
          <Item fixedLabel style={styles.label}>
            <Text fontStyle='semiBold'>{t('Plotline')}:</Text>
            <LinePicker selectedId={lineId} onChange={this.changeLine} />
          </Item>
          {this.renderAttachments()}
          <View style={[styles.afterList, styles.rceView]}>
            <Text fontStyle='semiBold' style={styles.label}>
              {t('Description')}:
            </Text>
            {/*<RichTextEditor
              initialValue={description}
              placeholder={t('Describe the scene')}
              onFocus={this.handleOnEditorFocus}
              onChange={this.handleDescriptionChange}
            />*/}

            <RichEditor
              initialHTMLText={description}
              placeholder={t('Describe the scene')}
              onFocus={this.handleOnEditorFocus}
              onChange={this.handleDescriptionChange}
            />
          </View>
        </View>
      </DetailsScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  },
  label: {
    marginBottom: Metrics.baseMargin
  },
  afterList: {
    marginTop: 16
  },
  badge: {
    marginRight: 8
  },
  rceView: {
    flex: 1
  },
  labelText: {
    ...Fonts.style.semiBold,
    fontSize: Fonts.size.h5
  }
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
  route: PropTypes.object.isRequired
}

function mapStateToProps (state) {
  return {
    chapters: selectors.sortedChaptersByBookSelector(state),
    lines: selectors.sortedLinesByBookSelector(state),
    isSeries: selectors.isSeriesSelector(state),
    positionOffset: selectors.positionOffsetSelector(state),
    cards: state.cards,
    bookId: selectors.currentTimelineSelector(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.cardActions, dispatch),
    uiActions: bindActionCreators(actions.uiActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SceneDetails)
