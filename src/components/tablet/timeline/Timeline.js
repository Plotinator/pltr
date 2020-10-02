import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { Animated, ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import { bindActionCreators } from 'redux'
import { actions, selectors, newIds, cardHelpers } from 'pltr/v2'
import ChapterTitleCell from './ChapterTitleCell'
import { BlankCell } from './BlankCell'
import Cell from '../shared/Cell'
import CardCell from './CardCell'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ColorPickerModal from '../shared/ColorPickerModal'
import { CELL_HEIGHT, CELL_WIDTH } from '../../../utils/constants'

const black = '#000'
const white = '#fff'

class Timeline extends Component {
  constructor(props) {
    super(props)

    this.headerScrollView = null
    this.scrollPosition = new Animated.Value(0)
    this.scrollEvent = Animated.event(
      [{ nativeEvent: { contentOffset: { x: this.scrollPosition } } }],
      { useNativeDriver: false },
    )
    this.state = {lineMapKeys: {}, showColorPicker: false}
    this.dropCoordinates = []
  }

  static getDerivedStateFromProps (props, state) {
    const { lineMap } = props
    return {
      lineMapKeys: Object.keys(lineMap),
      showColorPicker: state.showColorPicker,
    }
  }

  componentDidMount() {
    this.listener = this.scrollPosition.addListener(position => {
      this.headerScrollView.scrollTo({ x: position.value, animated: false })
    })
  }

  registerDropCoordinate = (cell) => {
    // ignore ids of 'new'
    if (cell.chapterId == 'new' || cell.lineId == 'new') return
    console.log('register', this.dropCoordinates.length)
    this.dropCoordinates.push(cell)
  }

  dropCard = (x, y, droppedCard) => {
    let moveToChapterId = null
    let moveToLineId = null
    let moveToIsBlank = false
    const success = this.dropCoordinates.some(coord => { // using .some to short circuit once we find one
      if (coord.chapterId == 'new' || coord.lineId == 'new') return false
      // check if it's within this one's bounds
      if (this.isWithinCell(x, y, coord)) {
        // do nothing for dropping on itself
        if (coord.chapterId != droppedCard.chapterId || coord.lineId != droppedCard.lineId) {
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
      this.dropCoordinates = this.dropCoordinates.filter(coord => {
        if (droppedCard.chapterId == coord.chapterId && droppedCard.lineId == coord.lineId) return false
        if (moveToIsBlank && moveToChapterId == coord.chapterId && moveToLineId == coord.lineId) return false
        return true
      })
      console.log('moving', this.dropCoordinates.length)
      // move the card to these coordinates
      this.props.cardActions.editCardCoordinates(droppedCard.id, moveToLineId, moveToChapterId, this.props.bookId)
    }
    return success
  }

  isWithinCell = (x, y, pair) => {
    const withinWidth = x > pair.x && x < (pair.x + CELL_WIDTH)
    const withinHeight = y > pair.y && y < (pair.y + CELL_HEIGHT)
    return withinWidth && withinHeight
  }

  showColorPicker = () => this.setState({showColorPicker: true})
  hideColorPicker = () => this.setState({showColorPicker: false})

  handleScroll = e => {
    console.log('HANDLE SCROLL')
    if (this.headerScrollView) {
      let scrollX = e.nativeEvent.contentOffset.x
      this.headerScrollView.scrollTo({ x: scrollX, animated: false })
    }
  }

  renderColorPicker () {
    if (!this.state.showColorPicker) return null

    return <ColorPickerModal onClose={this.hideColorPicker} chooseColor={this.hideColorPicker}/>
  }

  renderLineTitle (id, title) {
    return <Cell key={id} style={styles.lineTitleCell}>
      <TouchableOpacity onPress={this.showColorPicker}>
        <Text style={styles.lineTitle}>{title}</Text>
      </TouchableOpacity>
    </Cell>
  }

  renderNewChapter (id, title) {
    return <View key={id} style={styles.cell}>
      <Text>{title}</Text>
    </View>
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
      const { lineMap, cardMap } = this.props
      const { lineMapKeys } = this.state
      cells = lineMapKeys.map(linePosition => {

        const line = lineMap[linePosition]
        const cards = cardMap[`${line.id}-${chapter.id}`]
        const key = `${cards ? 'card' : 'blank'}-${chapter.position}-${linePosition}`
        if (cards) {
          return <CardCell key={key} card={cards[0]} color={line.color} register={this.registerDropCoordinate} handleDrop={this.dropCard} navigation={this.props.navigation}/>
        } else {
          return <BlankCell key={key} color={line.color} register={this.registerDropCoordinate} lineId={line.id} chapterId={chapter.id} handleDrop={this.dropCard} navigation={this.props.navigation}/>
        }
      })
    }
    // TODO: dont use corner cell
    cells.push(this.renderCornerCell()) // needed to show the + line cell

    return <View style={styles.column}>{cells}</View>
  }

  renderChapterTitles() {
    const { chapters } = this.props
    let cols = chapters.map(ch => <ChapterTitleCell key={ch.id} chapterId={ch.id} />)
    cols.push(this.renderNewChapter('new-chapter', '+'))

    return (
      <View style={styles.header}>
        {this.renderCornerCell()}
        <ScrollView
          ref={ref => (this.headerScrollView = ref)}
          horizontal={true}
          scrollEnabled={false}
          scrollEventThrottle={16}
        >
          {cols}
        </ScrollView>
      </View>
    )
  }

  renderLineTitles() {
    const { lines } = this.props
    let cells = lines.map(l => this.renderLineTitle(l.id, l.title))
    cells.push(this.renderLineTitle('new-line', '+'))

    return <View style={styles.lineTitlesColumn}>{cells}</View>
  }

  renderBody() {
    const { chapters } = this.props
    const cells = [...chapters, {id: 'new'}] // 'new' is needed to show the + chapter cell

    return (
      <View>
        {this.renderLineTitles()}
        <FlatList
          style={styles.body}
          horizontal={true}
          data={cells}
          renderItem={this.renderChapterColumn}
          keyExtractor={item => item.id.toString()}
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
    let data = [{ key: "body", render: body }]

    return (
      <View style={styles.container}>
        {this.renderChapterTitles()}
        { this.renderColorPicker()}
        <FlatList
          data={data}
          renderItem={this.renderMainRow}
        />
      </View>
    )
  }
}

const LEFT_COLUMN_WIDTH = 150

const styles = StyleSheet.create({
  container: { backgroundColor: 'hsl(210, 36%, 96%)', marginVertical: 2, marginBottom: 0 }, //gray-9
  header: { flexDirection: 'row' },
  cornerCell: { width: LEFT_COLUMN_WIDTH },
  lineTitlesColumn: { position: 'absolute', width: LEFT_COLUMN_WIDTH },
  lineTitleCell: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    width: LEFT_COLUMN_WIDTH,
  },
  lineTitle: {
    fontWeight: 'bold',
  },
  body: { marginLeft: LEFT_COLUMN_WIDTH },
  cell: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: black,
  },
  column: { flexDirection: 'column' },
})

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
  navigation: PropTypes.object.isRequired,
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
    nextChapterId: nextChapterId,
    lines: selectors.sortedLinesByBookSelector(state),
    cardMap: selectors.cardMapSelector(state),
    ui: state.ui,
    isSeries: selectors.isSeriesSelector(state),
    bookId: bookId,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.uiActions, dispatch),
    sceneActions: bindActionCreators(actions.sceneActions, dispatch),
    lineActions: bindActionCreators(actions.lineActions, dispatch),
    cardActions: bindActionCreators(actions.cardActions, dispatch),
    beatActions: bindActionCreators(actions.beatActions, dispatch),
    seriesLineActions: bindActionCreators(actions.seriesLineActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timeline)
