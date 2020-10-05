import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import t from 'format-message'
import { selectors, actions } from 'pltr/v2'
import { Card, CardItem, Text, View, Body, Left, Right } from 'native-base'
import { StyleSheet } from 'react-native'
import { isTablet } from 'react-native-device-info'
import RichTextEditor from '../RichTextEditor'

const isOnTablet = isTablet()

class SceneCard extends Component {

  navigateToDetails = () => {
    this.props.navigation.navigate('SceneDetails', {card: this.props.card})
  }

  renderDescription () {
    if (!isOnTablet) return null
    const { card } = this.props

    return <View style={{height: 100 * card.description.length, padding: 16}}>
      <RichTextEditor
        initialValue={card.description}
        onChange={() => {}}
        readOnly
      />
    </View>
  }

  render () {
    const { line, card } = this.props
    const lineColor = {color: line.color, fontSize: 12}
    return <Card style={[styles.card, {borderColor: line.color}]}>
      <CardItem button={isOnTablet} onPress={isOnTablet ? null : this.navigateToDetails}>
        <Left><Text>{card.title}</Text></Left>
        <Right><Text style={lineColor}>({line.title})</Text></Right>
      </CardItem>
      { this.renderDescription() }
    </Card>
  }
}

const styles = StyleSheet.create({
  card: {
    marginLeft: 20,
    marginRight: 8,
  },
})

SceneCard.propTypes = {
  card: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  reorder: PropTypes.func.isRequired,
  line: PropTypes.object.isRequired,
  tags: PropTypes.array.isRequired,
  characters: PropTypes.array.isRequired,
  places: PropTypes.array.isRequired,
  ui: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  images: PropTypes.object,
  isSeries: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
}

function mapStateToProps (state, ownProps) {
  let line = null
  let isSeries = selectors.isSeriesSelector(state)
  if (isSeries) {
    // get the right seriesLines
    line = state.seriesLines.find(sl => sl.id === ownProps.card.seriesLineId)
  } else {
    // get the right lines for state.ui.currentTimeline (bookId)
    line = state.lines.find(l => l.id == ownProps.card.lineId)
  }
  return {
    line: line,
    tags: state.tags,
    characters: state.characters,
    places: state.places,
    ui: state.ui,
    isSeries: isSeries,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.cardActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SceneCard)
