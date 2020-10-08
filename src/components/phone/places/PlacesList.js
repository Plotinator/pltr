import { sortBy } from 'lodash'
import React, { Component } from 'react'
import { SwipeListView } from 'react-native-swipe-list-view'
import { StyleSheet, Alert, LayoutAnimation } from 'react-native'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { selectors, actions } from 'pltr/v2'
import { View, ListItem, Icon, Left, Right, H3, Text, Button } from 'native-base'
import t from 'format-message'
import TrashButton from '../../ui/TrashButton'
import { askToDelete } from '../../../utils/delete'

class PlacesList extends Component {

  deletePlace = (place) => {
    askToDelete(place.name, () => this.props.actions.deletePlace(place.id))
  }

  navigateToDetails = (place) => {
    this.props.navigation.navigate('PlaceDetails', { place })
  }

  navigateToCustomAttributes = () => {
    this.props.navigation.navigate('CustomAttributesModal', {type: 'places'})
  }

  renderPlace = ({item}) => {
    return <ListItem noIndent button style={styles.row} onPress={() => this.navigateToDetails(item)}>
      <Left>
        <H3 style={styles.title}>{item.name || t('New Place')}</H3>
      </Left>
      <Right>
        <Icon type='FontAwesome5' name='chevron-right'/>
      </Right>
    </ListItem>
  }

  render () {
    return <View style={{flex: 1}}>
      <SwipeListView
        data={this.props.visiblePlaces}
        renderItem={this.renderPlace}
        renderHiddenItem={ (data, rowMap) => <TrashButton onPress={() => this.deletePlace(data.item)} />}
        keyExtractor={item => item.id}
        leftOpenValue={75}
      />
      <Button full info onPress={this.navigateToCustomAttributes}><Text>{t('Custom Attributes')}</Text></Button>
    </View>
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