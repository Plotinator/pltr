import { cloneDeep } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Text, Container, Content, H1, H2, Form, Input, Label, Item, Button, Picker, List, Left, Right, Badge, View, ListItem, Body, Icon } from 'native-base'
import { selectors, actions, initialState } from 'pltr/v2'
import { StyleSheet } from 'react-native'
import i18n from 'format-message'
import ChapterPicker from './ChapterPicker'
import LinePicker from './LinePicker'

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
    const { changes } = this.state
    const savedText = changes ? i18n('Save') : i18n('Saved')
    this.props.navigation.setOptions({
      headerRight: () => <Button success={!changes} warning={changes} transparent onPress={this.saveChanges}><Text>{savedText}</Text></Button>
    })
  }

  saveChanges = () => {
    if (!this.state.changes) return
    this.props.actions.addCard({...this.state.card, lineId: 1}) // TODO: remove lineId 1
    this.props.navigation.pop()
  }

  changeChapter = (val) => {
    this.setState({card: {...this.state.card, chapterId: val}, changes: true})
  }

  changeLine = (val) => {
    this.setState({card: {...this.state.card, lineId: val}, changes: true})
  }

  render () {
    const { card, isNewCard } = this.state
    return <Container>
      <Content style={styles.content}>
        <Form style={styles.form}>
          <Item inlineLabel last regular style={styles.label}>
            <Label>{i18n('Title')}</Label>
            <Input
              value={card.title}
              onChangeText={text => this.setState({card: {...card, title: text}, changes: true})}
              autoCapitalize='sentences'
              placeholder={isNewCard ? i18n('Scene Title') : ''}
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
          <View>
            <List>
              <ListItem>
                <Left>
                  <Badge style={styles.badge} info><Text>{card.characters.length}</Text></Badge>
                  <Text>{i18n('Characters')}</Text>
                </Left>
                <Right>
                  <Icon type='FontAwesome5' name='chevron-right'/>
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <Badge style={styles.badge} info><Text>{card.places.length}</Text></Badge>
                  <Text>{i18n('Places')}</Text>
                </Left>
                <Right>
                  <Icon type='FontAwesome5' name='chevron-right'/>
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <Badge style={styles.badge} info><Text>{card.tags.length}</Text></Badge>
                  <Text>{i18n('Tags')}</Text>
                </Left>
                <Right>
                  <Icon type='FontAwesome5' name='chevron-right'/>
                </Right>
              </ListItem>
            </List>
          </View>
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
  tags: PropTypes.array.isRequired,
  characters: PropTypes.array.isRequired,
  places: PropTypes.array.isRequired,
  ui: PropTypes.object.isRequired,
  books: PropTypes.object.isRequired,
  isSeries: PropTypes.bool.isRequired,
  positionOffset: PropTypes.number.isRequired,
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    chapters: selectors.chapters.sortedChaptersByBookSelector(state),
    lines: selectors.lines.sortedLinesByBookSelector(state),
    tags: selectors.tags.sortedTagsSelector(state),
    characters: selectors.characters.charactersSortedAtoZSelector(state),
    places: selectors.places.placesSortedAtoZSelector(state),
    ui: state.ui,
    books: state.books,
    isSeries: selectors.ui.isSeriesSelector(state),
    positionOffset: selectors.chapters.positionOffsetSelector(state),
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