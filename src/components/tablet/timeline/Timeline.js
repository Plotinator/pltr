import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { Animated, FlatList, ScrollView, StyleSheet, Text, View, Vibration } from 'react-native'
import { bindActionCreators } from 'redux'
import t from 'format-message'
import { actions, selectors, newIds, cardHelpers } from 'pltr/v2'
import ChapterTitleCell from './ChapterTitleCell'
import { BlankCell } from './BlankCell'
import Cell from '../shared/Cell'
import CardCell from './CardCell'
import { CELL_HEIGHT, CELL_WIDTH } from '../../../utils/constants'
import { Icon } from 'native-base'

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
    let moveToChapterId = null
    let moveToLineId = null
    let moveToIsBlank = false
    const success = this.dropCoordinates.some(coord => { // using .some to short circuit once we find one
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
      // when moving creates a scene stack, there are a lot more that re-register. Need to figure out which ones
      this.dropCoordinates = this.dropCoordinates.filter(coord => {
        // TODO: remove duplicates
        if (droppedCard.chapterId == coord.chapterId && droppedCard.lineId == coord.lineId) return false
        if (moveToIsBlank && moveToChapterId == coord.chapterId && moveToLineId == coord.lineId) return false
        return true
      })
      Vibration.vibrate()
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

  renderLineTitle (id, title) {
    return <Cell key={id} style={styles.lineTitleCell}>
      <Text style={styles.lineTitle}>{title}</Text>
    </Cell>
  }

  renderBlankLineTitleCell (key) {
    return <Cell key={key} style={styles.lineTitleCell} />
  }

  renderSpacerCard (key) {
    return <Cell key={key} />
  }

  renderPlusButton (id, onPress) {
    return <Cell key={id} style={styles.addCell} onPress={onPress}>
      <Icon type='FontAwesome5' name='plus' style={styles.plusButton}/>
    </Cell>
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
        const key = `${cards ? 'card' : 'blank'}-${chapter.position}-${linePosition}`
        if (cards) {
          cards.forEach((c, idx) => acc.push(<CardCell key={`${key}-${idx}`} card={c} color={line.color} showLine={idx == 0} register={this.registerDropCoordinate} handleDrop={this.dropCard} navigation={this.props.navigation}/>))
          if (cards.length < lineMaxCards) {
            for(i = cards.length; i < lineMaxCards; i++) {
              acc.push(this.renderSpacerCard(`${key}-spacer-${i}`))
            }
          }
        } else {
          acc.push(<BlankCell key={key} color={line.color} register={this.registerDropCoordinate} lineId={line.id} chapterId={chapter.id} handleDrop={this.dropCard} navigation={this.props.navigation}/>)
          if (lineMaxCards > 1) {
            for(i = 1; i < lineMaxCards; i++) {
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

  renderChapterTitles() {
    const { chapters } = this.props
    let cols = chapters.map(ch => <ChapterTitleCell key={ch.id} chapterId={ch.id} />)
    cols.push(this.renderPlusButton('new-chapter', this.handleAppendChapter))

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
    const { lines, linesMaxCards } = this.props
    let cells = lines.reduce((acc, l) => {
      acc.push(this.renderLineTitle(l.id, l.title))
      // start at 1 because the first cell is the title cell
      for(i = 1; i < linesMaxCards[l.id]; i++) {
        acc.push(this.renderBlankLineTitleCell(`${l.id}-blank-${i}`))
      }
      return acc
    }, [])
    cells.push(this.renderPlusButton('new-line', this.handleAppendLine))

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
        { this.renderChapterTitles() }
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
  container: { backgroundColor: 'hsl(210, 36%, 96%)', marginVertical: 2, marginBottom: 0, flex: 1 }, //gray-9
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
    fontSize: 18,
  },
  body: { marginLeft: LEFT_COLUMN_WIDTH },
  column: { flexDirection: 'column' },
  addCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    color: '#ff7f32',
  },
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
    linesMaxCards: selectors.lineMaxCardsSelector(state),
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
