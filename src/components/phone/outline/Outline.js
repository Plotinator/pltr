import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { StyleSheet, FlatList } from 'react-native'
import { SwipeRow } from 'react-native-swipe-list-view'
import { View, Text, Button, H3 } from 'native-base'
import t from 'format-message'
import cx from 'classnames'
import { selectors, cardHelpers } from 'pltr/v2'
import ErrorBoundary from '../../ErrorBoundary'
import Chapter from '../../shared/outline/Chapter'
import TrashButton from '../../ui/TrashButton'
import RenameButton from '../../ui/RenameButton'
import AddButton from '../../ui/AddButton'

class Outline extends Component {
  constructor (props) {
    super(props)
    this.state = {currentLine: null}
  }

  navigateToPlotlines = () => {
    this.props.navigation.navigate('PlotlinesModal')
  }

  renderChapterInner = (chapterTitle, cards, manualSort, navigateToNewCard) => {
    return <View>
      <SwipeRow leftOpenValue={75} rightOpenValue={-100}>
        <View style={styles.sliderRow}>
          <TrashButton buttonStyle={{flex: 0, height: '100%'}}/>
          <RenameButton buttonStyle={{flex: 0, height: '100%', width: 100}}/>
        </View>
        <View style={styles.chapterView}>
          <View style={styles.title}>
            <H3>{chapterTitle}</H3>
            <AddButton onPress={navigateToNewCard} iconStyle={styles.addScene} />
          </View>
          { manualSort }
        </View>
      </SwipeRow>
      { cards }
    </View>
  }

  renderChapter (chapter, cardMap) {
    return <ErrorBoundary key={chapter.id}>
      <Chapter chapter={chapter} cards={cardMap[chapter.id]}
        activeFilter={!!this.state.currentLine}
        navigation={this.props.navigation}
        render={this.renderChapterInner}
      />
    </ErrorBoundary>
  }

  render () {
    const { chapters, lines, card2Dmap } = this.props
    const cardMap = cardHelpers.cardMapping(chapters, lines, card2Dmap, this.state.currentLine)
    return <View style={{flex: 1}}>
      <FlatList
        data={chapters}
        renderItem={({item}) => this.renderChapter(item, cardMap)}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.content}
      />
      <Button full info onPress={this.navigateToPlotlines}><Text>{t('Plotlines')}</Text></Button>
    </View>
  }
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
  },
  addScene: {
    fontSize: 16,
  },
  chapterView: {
    backgroundColor: 'white',
    padding: 8,
  },
  sliderRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

Outline.propTypes = {
  chapters: PropTypes.array.isRequired,
  lines: PropTypes.array.isRequired,
  card2Dmap: PropTypes.object.isRequired,
  file: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  isSeries: PropTypes.bool,
  navigation: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    chapters: selectors.sortedChaptersByBookSelector(state),
    lines: selectors.sortedLinesByBookSelector(state),
    card2Dmap: selectors.cardMapSelector(state),
    file: state.file,
    ui: state.ui,
    isSeries: selectors.isSeriesSelector(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Outline)
