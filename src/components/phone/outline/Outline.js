import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { StyleSheet, FlatList } from 'react-native'
import t from 'format-message'
import cx from 'classnames'
import { selectors, cardHelpers } from 'pltr/v2'
import { View, Text, Button } from 'native-base'
import ErrorBoundary from '../../ErrorBoundary'
import Chapter from './Chapter'

class Outline extends Component {
  constructor (props) {
    super(props)
    this.state = {currentLine: null}
  }

  navigateToPlotlines = () => {
    this.props.navigation.navigate('PlotlinesModal')
  }

  renderChapter (chapter, cardMap) {
    return <ErrorBoundary key={chapter.id}>
      <Chapter chapter={chapter} cards={cardMap[chapter.id]} activeFilter={!!this.state.currentLine} navigation={this.props.navigation} />
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
