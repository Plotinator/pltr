import React, { Component } from 'react'
import { SwipeListView } from 'react-native-swipe-list-view'
import { StyleSheet, Dimensions, FlatList, TouchableHighlight } from 'react-native'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'pltr/v2'
import { SwipeRow } from 'react-native-swipe-list-view'
import { ListItem, Icon, Left, Right, H2, H3, View, Badge, Text, Card, CardItem, Button, H1 } from 'native-base'
import t from 'format-message'
import TrashButton from '../../ui/TrashButton'
import EditButton from '../../ui/EditButton'
import Book from '../../shared/project/Book'

class Project extends Component {
  state = {data: []}

  static getDerivedStateFromProps (props, state) {
    const seriesObj = {id: 'series', ...props.series}
    const bookObjs = props.books.allIds.map(id => props.books[id])
    return {data: [seriesObj, ...bookObjs]}
  }

  deleteBook = (id) => {
    this.props.bookActions.deleteBook(id)
  }

  navigateToDetails = (id) => {
    this.props.navigation.push('SeriesDetails', { id })
  }

  navigateToOutline = (id) => {
    this.props.actions.changeCurrentTimeline(id)
    this.props.navigation.push('OutlineHome')
  }

  renderSeries = (series) => {
    return <SwipeRow rightOpenValue={-75}>
      <View style={styles.hiddenRow}>
        <Text></Text>
        <EditButton onPress={() => this.navigateToDetails(series.id)} buttonStyle={{flex: 0, height: '100%'}} />
      </View>
      <View>
        <ListItem noIndent button style={styles.row} onPress={() => this.navigateToOutline(series.id)}>
          <Left>
            <H3 style={styles.title}>{t('Series Outline')}</H3>
          </Left>
          <Right>
            <Icon type='FontAwesome5' name='chevron-right'/>
          </Right>
        </ListItem>
      </View>
    </SwipeRow>
  }

  renderItem = ({item}) => {
    if (item.id == 'series') return this.renderSeries(item)

    return <Book book={item} navigateToOutline={this.navigateToOutline} navigateToDetails={this.navigateToDetails} />
  }

  render () {
    return <FlatList
      data={this.state.data}
      renderItem={this.renderItem}
      keyExtractor={item => item.id.toString()}
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
})

Project.propTypes = {
  series: PropTypes.object.isRequired,
  books: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  bookActions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    series: state.series,
    books: state.books,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.uiActions, dispatch),
    bookActions: bindActionCreators(actions.bookActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Project)