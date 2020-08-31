import { cloneDeep } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Text, Container, Content, H1, H2, Form, Input, Label, Item, Button, Picker, List, Left, Right, Badge, View, ListItem, Body, Icon } from 'native-base'
import { selectors, actions, initialState } from 'pltr/v2'
import { StyleSheet } from 'react-native'
import i18n from 'format-message'
import ChapterPicker from '../../ui/ChapterPicker'
import LinePicker from '../../ui/LinePicker'
import SaveButton from '../../ui/SaveButton'
import AttachmentList from '../attachments/AttachmentList'

// cooresponds to CardDialog in desktop

class SceneDetails extends Component {
  constructor (props) {
    super(props)
    const { route } = props
    const { isNewCard, card, chapterId } = route.params
    this.state = {
      isNewCard: isNewCard,
      chapterId: chapterId,
      card: isNewCard ? {...cloneDeep(initialState.card), chapterId: chapterId} : card,
      changes: isNewCard,
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
    if (!this.state.changes) return
    if (this.state.isNewCard) {
      this.props.actions.addCard({...this.state.card, lineId: 1}) // TODO: remove lineId 1
      this.props.navigation.setParams({isNewCard: false})
    } else {
      // TODO: save an existing card
    }
    this.setState({isNewCard: false, changes: false})
  }

  changeChapter = (val) => {
    this.setState({card: {...this.state.card, chapterId: val}, changes: true})
  }

  changeLine = (val) => {
    this.setState({card: {...this.state.card, lineId: val}, changes: true})
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
    return <Container>
      <Content style={styles.content}>
        <Form style={styles.form}>
          <Item inlineLabel last regular style={styles.label}>
            <Label>{i18n('Title')}</Label>
            <Input
              value={card.title}
              onChangeText={text => this.setState({card: {...card, title: text}, changes: true})}
              autoCapitalize='sentences'
            />
          </Item>
          <Item fixedLabel style={styles.label}>
            <Label>{i18n('Chapter')}</Label>
            <ChapterPicker selectedId={card.chapterId} onChange={this.changeChapter} />
          </Item>
          <Item fixedLabel style={styles.label}>
            <Label>{i18n('Plotline')}</Label>
            <LinePicker selectedId={card.lineId} onChange={this.changeLine} />
          </Item>
          { this.renderAttachments() }
          <Item inlineLabel last regular style={[styles.label, styles.afterList]}>
            <Label>{i18n('Description')}</Label>
          </Item>
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
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    chapters: selectors.sortedChaptersByBookSelector(state),
    lines: selectors.sortedLinesByBookSelector(state),
    isSeries: selectors.isSeriesSelector(state),
    positionOffset: selectors.positionOffsetSelector(state),
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