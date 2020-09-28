import { cloneDeep } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, Content, Form, Input, Label, Item, View } from 'native-base'
import { selectors, actions, initialState } from 'pltr/v2'
import { StyleSheet } from 'react-native'
import t from 'format-message'
import ChapterPicker from '../../ui/ChapterPicker'
import LinePicker from '../../ui/LinePicker'
import SaveButton from '../../ui/SaveButton'
import AttachmentList from '../../shared/attachments/AttachmentList'
import RichTextEditor from '../../ui/RichTextEditor'

// cooresponds to CardDialog in desktop

class SceneDetails extends Component {
  state = {}

  static getDerivedStateFromProps (props, state) {
    const { route, cards } = props
    const { isNewCard, card, chapterId } = route.params
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

  saveChanges = () => {
    const { changes, isNewCard, card } = this.state
    if (!changes) return
    if (isNewCard) {
      this.props.actions.addCard({...card, lineId: 1}) // TODO: remove lineId 1
      this.props.navigation.setParams({isNewCard: false})
    } else {
      this.props.actions.editCard(card.id, card.title, card.description)
    }
    this.setState({isNewCard: false, changes: false})
  }

  changeChapter = (val) => {
    const { card } = this.state
    this.setState({card: {...card, chapterId: val}})
    this.props.actions.changeScene(card.id, val, this.props.bookId)
  }

  changeLine = (val) => {
    const { card } = this.state
    this.setState({card: {...card, lineId: val}})
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
    const { card } = this.state
    return <Container style={{flex: 1}}>
      <Content style={styles.content} contentContainerStyle={{flex: 1}}>
        <Form style={styles.form}>
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
            <ChapterPicker selectedId={card.chapterId} onChange={this.changeChapter} />
          </Item>
          <Item fixedLabel style={styles.label}>
            <Label>{t('Plotline')}</Label>
            <LinePicker selectedId={card.lineId} onChange={this.changeLine} />
          </Item>
          { this.renderAttachments() }
          <View style={[styles.afterList, { flex: 1 }]}>
            <Label>{t('Description')}</Label>
            <RichTextEditor
              initialValue={card.description}
              onChange={val => this.setState({card: {...card, description: val}, changes: true}) }
            />
          </View>
        </Form>
      </Content>
    </Container>
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  label: {
    marginBottom: 16,
  },
  afterList: {
    marginTop: 16,
  },
  form: {
    flex: 1,
    marginVertical: 16,
  },
  badge: {
    marginRight: 8,
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