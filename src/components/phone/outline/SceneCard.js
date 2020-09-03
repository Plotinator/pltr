import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import i18n from 'format-message'
import { selectors, actions } from 'pltr/v2'
import { Card, CardItem, Text, View, Body, Left, Right } from 'native-base'
import { StyleSheet } from 'react-native'

class SceneCard extends Component {

  navigateToDetails = () => {
    this.props.navigation.navigate('SceneDetails', {card: this.props.card})
  }

  render () {
    const { line, ui, card } = this.props
    const lineColor = {color: line.color, fontSize: 12}
    return <Card style={[styles.card, {borderColor: line.color}]}>
      <CardItem button onPress={this.navigateToDetails} style={styles.cardTitle}>
        <Text>{card.title}</Text>
        <Text style={lineColor}>({line.title})</Text>
      </CardItem>
      <CardItem button onPress={this.navigateToDetails}>
        <Body>
          <Text note>Description</Text>
        </Body>
      </CardItem>
    </Card>
  }
}

const styles = StyleSheet.create({
  card: {
    marginLeft: 20,
    marginRight: 8,
  },
  cardTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
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
