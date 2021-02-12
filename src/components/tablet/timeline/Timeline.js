import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import {
  TouchableWithoutFeedback,
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
  Vibration
} from 'react-native'
import { bindActionCreators } from 'redux'
import t from 'format-message'
import { actions, selectors, newIds, cardHelpers } from 'pltr/v2'
import ChapterTitleCell from './ChapterTitleCell'
import { BlankCell } from './BlankCell'
import Cell from '../shared/Cell'
import CardCell from './CardCell'
import {
  CELL_HEIGHT,
  CELL_WIDTH
} from '../../../utils/constants'
import { Icon } from 'native-base'
import tinycolor from 'tinycolor2'
import LineTitleCell from './LineTitleCell'
import ColorPickerModal from '../shared/ColorPickerModal'
import { Text, Input, Button, ShellButton, ModalBox } from '../../shared/common'
import styles from './TimelineStyles'
import { showAlert } from '../../shared/common/AlertDialog'

class Timeline extends Component {
  constructor (props) {
    super(props)
    this.headerScrollView = null
    this.scrollPosition = new Animated.Value(0)
    this.scrollX = 0
    this.scrollEvent = Animated.event(
      [{ nativeEvent: { contentOffset: { x: this.scrollPosition } } }],
      { useNativeDriver: false }
    )
    this.verticalScrollPosition = new Animated.Value(0)
    this.scrollY = 0
    this.verticalScrollEvent = Animated.event(
      [{ nativeEvent: { contentOffset: { y: this.verticalScrollPosition } } }],
      { useNativeDriver: false }
    )
    this.state = {
      lineMapKeys: {},
      showColorPicker: false,
      currentLine: {}
    }
    this.dropCoordinates = []
  }

  static getDerivedStateFromProps (props, state) {
    const { lineMap } = props
    return {
      lineMapKeys: Object.keys(lineMap),
      showColorPicker: state.showColorPicker
    }
  }

  componentDidMount () {
    this.listener = this.scrollPosition.addListener((position) => {
      this.scrollX = position.value
      this.headerScrollView.scrollTo({ x: position.value, animated: false })
    })
    this.listener = this.verticalScrollPosition.addListener((position) => {
      this.scrollY = position.value
    })
  }

  componentWillUnmount () {
    this.scrollPosition.removeAllListeners()
    this.verticalScrollPosition.removeAllListeners()
  }

  handleAppendLine = () => {
    const title = t('New Plotline')
    if (this.props.isSeries) {
      this.props.seriesLineActions.addLineWithTitle(title)
    } else {
      this.props.lineActions.addLineWithTitle(title, this.props.bookId)
    }
  }

  handleAppendChapter = () => {
    if (this.props.isSeries) {
      this.props.beatActions.addBeat()
    } else {
      this.props.sceneActions.addScene(this.props.bookId)
    }
  }

  registerDropCoordinate = (cell) => {
    // ignore ids of 'new'
    if (cell.chapterId == 'new' || cell.lineId == 'new') return
    this.dropCoordinates.push(cell)
  }

  dropCard = (x, y, droppedCard) => {
    const trueX = x + this.scrollX
    const trueY = y + this.scrollY
    let moveToChapterId = null
    let moveToLineId = null
    let moveToIsBlank = false
    const success = this.dropCoordinates.some((coord) => {
      // using .some to short circuit once we find one
      // check if it's within this one's bounds
      if (this.isWithinCell (trueX, trueY, coord)) {
        // do nothing for dropping on itself
        if (
          coord.chapterId != droppedCard.chapterId ||
          coord.lineId != droppedCard.lineId
        ) {
          moveToChapterId = coord.chapterId
          moveToLineId = coord.lineId
          moveToIsBlank = coord.isBlank
          return true
        }
      }
      return false
    })
    if (success) {
      // remove the two that have changed
      // only one has changed if moveToIsBlank == false
      // when moving creates a scene stack, there are a lot more that re-register. Need to figure out which ones
      this.dropCoordinates = this.dropCoordinates.filter((coord) => {
        // TODO: remove duplicates
        if (
          droppedCard.chapterId == coord.chapterId &&
          droppedCard.lineId == coord.lineId
        )
          return false
        if (
          moveToIsBlank &&
          moveToChapterId == coord.chapterId &&
          moveToLineId == coord.lineId
        )
          return false
        return true
      })
      Vibration.vibrate()
      // move the card to these coordinates
      this.props.cardActions.editCardCoordinates(
        droppedCard.id,
        moveToLineId,
        moveToChapterId,
        this.props.bookId
      )
    }
    return success
  }

  isWithinCell = (x, y, pair) => {
    const withinWidth = x > pair.x && x < pair.x + CELL_WIDTH
    const withinHeight = y > pair.y && y < pair.y + CELL_HEIGHT
    return withinWidth && withinHeight
  }

  showColorPicker = () => this.setState({ showColorPicker: true })
  hideColorPicker = () => this.setState({ showColorPicker: false })

  handleScroll = (e) => {
    console.log('HANDLE SCROLL')
    if (this.headerScrollView) {
      let scrollX = e.nativeEvent.contentOffset.x
      this.headerScrollView.scrollTo({ x: scrollX, animated: false })
    }
  }

  handleHideColorPicker = () =>
    this.setState({ showColorPicker: false })

  handleShowColorPicker = () =>
    this.setState({ showColorPicker: true })

  handleEditPlotLine = (line) => {
    this.setState(
      {
        currentLine: { ...line }
      },
      () => {
        this._PlotModal.show()
      }
    )
  }

  handleCurrentLineColor = (color) => {
    const { currentLine } = this.state
    currentLine.color = color
    this.setState({
      currentLine,
      showColorPicker: false
    })
  }

  handleCloseColorPicker = (color) => {
    this.setState({
      showColorPicker: false
    })
  }

  handleSetPlotTitle = (title) => {
    const { currentLine } = this.state
    currentLine.title = title
    this.setState({ currentLine })
  }

  handleSetPlotColor = (color) => {
    const { currentLine } = this.state
    currentLine.color = color
    this.setState({ currentLine })
  }

  handleDeletePlotline = () => {
    const { currentLine: { title, id, bookId } } = this.state
    this._PlotModal.hide()
    setTimeout(() => {
      // delay for 1 sec
      showAlert({
        title: t('Delete Plotline'),
        message: t('Delete Plotline {name}?', { name: title }),
        actions: [{
          id,
          bookId,
          icon: 'trash',
          danger: true,
          name: t('Yes, Delete'),
          callback: this.handleDeleteLine
        },
        {
          name: t('Cancel')
        }]
      })
    }, 300)
  }

  handleDeleteLine = ({ id, bookId }) => {
    const { lineActions } = this.props
    this._PlotModal.hide()
    lineActions.deleteLine(id, bookId)
    this.handleClearCurrentLine()
  }

  handleSavePlotline = () => {
    const { currentLine: { id, title, color } } = this.state
    const { lineActions } = this.props
    lineActions.editLine(id, title, color)
    this._PlotModal.hide()
  }

  handleClearCurrentLine = () => {
    this.setState({ currentLine: {} })
  }

  setPlotModalRef = (ref) => (this._PlotModal = ref)

  renderBlankLineTitleCell (key) {
    return <Cell key={key} style={styles.lineTitleCell} />
  }

  renderSpacerCard (key) {
    return <Cell key={key} />
  }

  renderPlusButton (id, onPress) {
    return (
      <Cell key={id} style={styles.addCell} onPress={onPress}>
        <Icon type='FontAwesome5' name='plus' style={styles.plusButton} />
      </Cell>
    )
  }

  renderCornerCell () {
    return <Cell key='corner-cell' style={styles.cornerCell} />
  }

  renderChapterColumn = (section) => {
    let { item: chapter } = section
    let cells = []
    if (chapter.new) {
      cells = [<Cell key='+'></Cell>]
    } else {
      const { lineMap, cardMap, linesMaxCards } = this.props
      const { lineMapKeys } = this.state
      cells = lineMapKeys.reduce((acc, linePosition) => {
        const line = lineMap[linePosition]
        const lineMaxCards = linesMaxCards[line.id]
        const cards = cardMap[`${line.id}-${chapter.id}`]
        const key = `${cards ? 'card' : 'blank'}-${
          chapter.position
        }-${linePosition}`
        if (cards) {
          cards.forEach((c, idx) =>
            acc.push(
              <CardCell
                key={`${key}-${idx}`}
                card={c}
                color={line.color}
                showLine={idx == 0}
                register={this.registerDropCoordinate}
                handleDrop={this.dropCard}
                navigation={this.props.navigation}
              />
            )
          )
          if (cards.length < lineMaxCards) {
            for (let i = cards.length; i < lineMaxCards; i++) {
              acc.push(this.renderSpacerCard(`${key}-spacer-${i}`))
            }
          }
        } else {
          acc.push(
            <BlankCell
              key={key}
              color={line.color}
              register={this.registerDropCoordinate}
              lineId={line.id}
              chapterId={chapter.id}
              handleDrop={this.dropCard}
              navigation={this.props.navigation}
            />
          )
          if (lineMaxCards > 1) {
            for (let i = 1; i < lineMaxCards; i++) {
              acc.push(this.renderSpacerCard(`${key}-spacer-${i}`))
            }
          }
        }

        return acc
      }, [])
    }
    // TODO: dont use corner cell
    cells.push(this.renderCornerCell()) // needed to show the + line cell

    return <View style={styles.column}>{cells}</View>
  }

  renderChapterTitles () {
    const { chapters, bookId } = this.props
    let cols = chapters.map((ch) => (
      <ChapterTitleCell key={ch.id} chapterId={ch.id} bookId={bookId} />
    ))
    cols.push(this.renderPlusButton('new-chapter', this.handleAppendChapter))

    return (
      <View style={styles.header}>
        {this.renderCornerCell()}
        <ScrollView
          ref={(ref) => (this.headerScrollView = ref)}
          horizontal={true}
          scrollEnabled={false}
          scrollEventThrottle={16}>
          <TouchableWithoutFeedback>
            <View style={styles.table}>
              {cols}
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </View>
    )
  }

  renderLineTitles () {
    const { lines, linesMaxCards } = this.props
    let cells = lines.reduce((acc, line) => {
      acc.push(
        <LineTitleCell
          key={line.id}
          line={line}
          editPlotLine={this.handleEditPlotLine}
        />
      )
      // start at 1 because the first cell is the title cell
      for (i = 1; i < linesMaxCards[line.id]; i++) {
        acc.push(this.renderBlankLineTitleCell(`${line.id}-blank-${i}`))
      }
      return acc
    }, [])
    cells.push(this.renderPlusButton('new-line', this.handleAppendLine))

    return <View style={styles.lineTitlesColumn}>{cells}</View>
  }

  renderPlotlineModal () {
    const { currentLine: { title, color } } = this.state
    return (
      <ModalBox
        title={t('Edit Plotline')}
        ref={this.setPlotModalRef}
        onHide={this.handleClearCurrentLine}>
        <View style={styles.row}>
          <Input
            inset
            small
            label={t('Title')}
            value={title}
            autoCapitalize='sentences'
            onChangeText={this.handleSetPlotTitle}
          />
        </View>
        <View style={styles.row}>
          <Input
            inset
            small
            label={t('Color')}
            style={styles.input}
            value={color}
            onChangeText={this.handleSetPlotColor} />
          <ShellButton
            style={[
              styles.colorSwatch,
              { backgroundColor: tinycolor(color).toHexString() }
            ]}
            onPress={this.handleShowColorPicker}>
            <Icon name='pen' type='FontAwesome5' style={styles.pen} />
          </ShellButton>
        </View>
        <View style={[styles.row, styles.last]}>
          <View style={styles.ctaButtons}>
            <Button
              center
              style={styles.button}
              onPress={this.handleSavePlotline}>
              {t('Save Plotline')}
            </Button>
            <Button
              center
              buttonColor='transparent'
              style={styles.trashButton}
              onPress={this.handleDeletePlotline}>
              <Icon name='trash' type='FontAwesome5' style={styles.trash} />
            </Button>
          </View>
        </View>
      </ModalBox>
    )
  }

  renderColorPicker () {
    const { showColorPicker, currentLine: { color = 'red' } } = this.state
    return (
      <ColorPickerModal
        visible={showColorPicker}
        chooseColor={this.handleCurrentLineColor}
        currentColor={color}
        onClose={this.handleCloseColorPicker}
      />
    )
  }

  renderBody () {
    const { chapters } = this.props
    const cells = [...chapters, { id: 'new' }] // 'new' is needed to show the + chapter cell

    return (
      <View>
        {this.renderLineTitles()}
        <FlatList
          style={styles.body}
          horizontal={true}
          data={cells}
          renderItem={this.renderChapterColumn}
          keyExtractor={(item) => item.id.toString()}
          stickyHeaderIndices={[0]}
          onScroll={this.scrollEvent}
          scrollEventThrottle={16}
          extraData={this.state}
        />
      </View>
    )
  }

  renderMainRow = (section) => {
    let { item } = section
    return item.render
  }

  render () {
    let body = this.renderBody()
    let data = [{ key: 'body', render: body }]

    return (
      <View style={styles.container}>
        {this.renderChapterTitles()}
        {this.renderColorPicker()}
        <FlatList
          data={data}
          renderItem={this.renderMainRow}
          onScroll={this.verticalScrollEvent}
        />
      {this.renderPlotlineModal()}
      </View>
    )
  }
}

Timeline.propTypes = {
  chapters: PropTypes.array,
  lineMap: PropTypes.object.isRequired,
  nextChapterId: PropTypes.number,
  beats: PropTypes.array,
  lines: PropTypes.array,
  seriesLines: PropTypes.array,
  cardMap: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  bookId: PropTypes.any,
  navigation: PropTypes.object.isRequired
}

function mapStateToProps (state) {
  let nextChapterId = -1
  const bookId = selectors.currentTimelineSelector(state)
  if (bookId == 'series') {
    nextChapterId = newIds.nextId(state.beats)
  } else {
    nextChapterId = newIds.nextId(state.chapters)
  }
  return {
    chapters: selectors.sortedChaptersByBookSelector(state),
    lineMap: selectors.linePositionMappingSelector(state),
    linesMaxCards: selectors.lineMaxCardsSelector(state),
    nextChapterId: nextChapterId,
    lines: selectors.sortedLinesByBookSelector(state),
    cardMap: selectors.cardMapSelector(state),
    ui: state.ui,
    isSeries: selectors.isSeriesSelector(state),
    bookId: bookId
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.uiActions, dispatch),
    sceneActions: bindActionCreators(actions.sceneActions, dispatch),
    lineActions: bindActionCreators(actions.lineActions, dispatch),
    cardActions: bindActionCreators(actions.cardActions, dispatch),
    beatActions: bindActionCreators(actions.beatActions, dispatch),
    seriesLineActions: bindActionCreators(actions.seriesLineActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Timeline)
