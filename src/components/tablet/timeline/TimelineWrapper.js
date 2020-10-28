import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { StyleSheet, FlatList } from 'react-native'
import t from 'format-message'
import cx from 'classnames'
import { selectors, cardHelpers } from 'pltr/v2'
import { View, Text, Button, Picker } from 'native-base'
import ErrorBoundary from '../../shared/ErrorBoundary'
import Toolbar from '../shared/Toolbar'
import SeriesPicker from '../shared/SeriesPicker'
import Timeline from './Timeline'
import DrawerButton from '../../ui/DrawerButton'

class TimelineWrapper extends Component {
  render () {
    return <View style={{flex: 1}}>
      <Toolbar>
        <DrawerButton openDrawer={this.props.openDrawer} />
        <SeriesPicker />
      </Toolbar>
      <ErrorBoundary>
        <Timeline navigation={this.props.navigation}/>
      </ErrorBoundary>
    </View>
  }
}

const styles = StyleSheet.create({

})

TimelineWrapper.propTypes = {
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
)(TimelineWrapper)
