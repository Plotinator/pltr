import { sortBy } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import t from 'format-message'
import cx from 'classnames'
import { selectors, actions } from 'pltr/v2'
import { View, H3, Text, Button, H1, Icon, Content } from 'native-base'
import { Col, Grid } from 'react-native-easy-grid'
import ErrorBoundary from '../../ErrorBoundary'
import Toolbar from '../../ui/Toolbar'
import TrashButton from '../../ui/TrashButton'
import Place from './Place'

class Places extends Component {
  state = {
    activePlace: null,
  }

  static getDerivedStateFromProps (props, state) {
    const activePlace = Places.findActivePlace(props.visiblePlaces, state.activePlace)
    return { activePlace }
  }

  static findActivePlace (places, activePlace) {
    if (places.length == 0) return null

    let returnPlace = places[0]

    // check for the currently active one
    if (activePlace != null) {
      let existingPlace = places.find(pl => pl.id === activePlace.id)
      if (existingPlace) returnPlace = existingPlace
    }

    return returnPlace
  }

  savePlace = (id, attributes) => {
    this.props.actions.editPlace(id, attributes)
  }

  deletePlace = (id) => {
    this.props.actions.deletePlace(id)
  }

  renderPlaceItem = ({item}) => {
    return <Grid style={[{flex: 1}, styles.placeItem]}>
      <Col size={9}>
        <TouchableOpacity onPress={() => this.setState({activePlace: item})}>
          <Text>{item.name}</Text>
        </TouchableOpacity>
      </Col>
      <Col size={3}>
        <Button small light bordered onPress={() => this.deletePlace(item.id)}>
          <Icon type='FontAwesome5' name='trash' />
        </Button>
      </Col>
    </Grid>
  }

  renderPlaceList () {
    const { visiblePlaces } = this.props
    return <View style={styles.placeList}>
      <H1 style={styles.title}>{t('Places')}</H1>
      <FlatList
        data={visiblePlaces}
        renderItem={this.renderPlaceItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  }

  renderPlaceDetail () {
    const { visiblePlaces, customAttributes, navigation } = this.props
    let place = this.state.activePlace
    if (!place) place = visiblePlaces[0]
    if (!place) return null

    return <ErrorBoundary>
      <Place key={place.id} place={place} customAttributes={customAttributes} onSave={this.savePlace} navigation={navigation}/>
    </ErrorBoundary>
  }

  render () {
    return <View style={{flex: 1}}>
      <Toolbar>
        <Button bordered><Text>{t('New')}</Text></Button>
      </Toolbar>
      <Grid style={{flex: 1}}>
        <Col size={4}>
          { this.renderPlaceList() }
        </Col>
        <Col size={10}>
          { this.renderPlaceDetail() }
        </Col>
      </Grid>
    </View>
  }
}

const styles = StyleSheet.create({
  placeList: {
    height: '100%',
    padding: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  placeItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 8,
    borderColor: 'hsl(210, 36%, 96%)', //gray-9
    borderWidth: 1,
  },
  buttonWrapper: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
})

Places.propTypes = {
  places: PropTypes.array.isRequired,
  visiblePlaces: PropTypes.array.isRequired,
  filterIsEmpty: PropTypes.bool.isRequired,
  customAttributes: PropTypes.array.isRequired,
  customAttributesThatCanChange: PropTypes.array,
  restrictedValues: PropTypes.array,
  ui: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  customAttributeActions: PropTypes.object.isRequired,
  uiActions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    places: state.places,
    visiblePlaces: selectors.visibleSortedPlacesSelector(state),
    filterIsEmpty: selectors.placeFilterIsEmptySelector(state),
    customAttributes: state.customAttributes.places,
    customAttributesThatCanChange: selectors.placeCustomAttributesThatCanChangeSelector(state),
    restrictedValues: selectors.placeCustomAttributesRestrictedValues(state),
    ui: state.ui,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.placeActions, dispatch),
    customAttributeActions: bindActionCreators(actions.customAttributeActions, dispatch),
    uiActions: bindActionCreators(actions.uiActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Places)
