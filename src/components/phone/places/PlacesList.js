import { sortBy } from 'lodash'
import React, { Component } from 'react'
import { SwipeListView } from 'react-native-swipe-list-view'
import { StyleSheet } from 'react-native'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { selectors, actions } from 'pltr/v2'
import { View, ListItem, Icon, Left, Right, H3, Text, Button } from 'native-base'
import i18n from 'format-message'

class PlacesList extends Component {

  deletePlace = (id) => {
    this.props.actions.deletePlace(id)
  }

  navigateToDetails = (place) => {
    this.props.navigation.navigate('PlaceDetails', { place })
  }

  renderPlace = ({item}) => {
    return <ListItem noIndent button style={styles.row} onPress={() => this.navigateToDetails(item)}>
      <Left>
        <H3 style={styles.title}>{item.name || i18n('New Place')}</H3>
      </Left>
      <Right>
        <Icon type='FontAwesome5' name='chevron-right'/>
      </Right>
    </ListItem>
  }

  render () {
    return <SwipeListView
      data={this.props.visiblePlaces}
      renderItem={this.renderPlace}
      renderHiddenItem={ (data, rowMap) => {
        const place = data.item
        return <Button full danger style={[ { flex: 1, width: 75 } ]} onPress={() => this.deletePlace(place.id)} >
          <Icon type='FontAwesome5' name='trash'/>
        </Button>
      }}
      keyExtractor={item => item.id}
      leftOpenValue={75}
    />
  }
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: 'white',
  },
  title: {
    paddingVertical: 4,
  },
  hiddenRow: {

  }
})

PlacesList.propTypes = {
  visiblePlaces: PropTypes.array.isRequired,
  customAttributes: PropTypes.array.isRequired,
  customAttributesThatCanChange: PropTypes.array,
  restrictedValues: PropTypes.array,
  ui: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    visiblePlaces: selectors.visibleSortedPlacesSelector(state),
    customAttributes: state.customAttributes.places,
    customAttributesThatCanChange: selectors.placeCustomAttributesThatCanChangeSelector(state),
    restrictedValues: selectors.placeCustomAttributesRestrictedValues(state),
    ui: state.ui,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.placeActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlacesList)