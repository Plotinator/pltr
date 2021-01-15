import React, { Component } from 'react'
import { SwipeListView } from 'react-native-swipe-list-view'
import { StyleSheet, Alert } from 'react-native'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'pltr/v2'
import { ListItem, Icon, Left, Right, H3, View, Badge } from 'native-base'
import t from 'format-message'
import TrashButton from '../../ui/TrashButton'
import { Text } from '../../shared/common'
import tinycolor from 'tinycolor2'

class TagsList extends Component {

  deleteTag = (tag) => {
    const { title, id } = tag
    Alert.alert(
      t('Delete Tag'),
      t('Delete {title} Tag?', { title }),
      [
        {text: t('Yes, Delete'), onPress: () => {
          this.props.actions.deleteTag(id)
        }},
        {text: t('No'), onPress: () => {}, style: 'cancel'},
      ]
    )
  }

  navigateToDetails = (tag) => {
    this.props.navigation.navigate('TagDetails', { tag })
  }

  renderTag = ({item}) => {
    const colorObj = tinycolor(item.color || 'black')
    const backgroundColor = {backgroundColor: colorObj.toHexString()}
    return <ListItem noIndent button style={styles.row} onPress={() => this.navigateToDetails(item)}>
      <Left>
        <View style={styles.rowView}>
          <Text fontStyle='semiBold' fontSize='h4' style={styles.title}>{item.title || t('New Tag')}</Text>
          <Badge style={[styles.badge, backgroundColor]}></Badge>
        </View>
      </Left>
      <Right>
        <Icon type='FontAwesome5' name='chevron-right'/>
      </Right>
    </ListItem>
  }

  render () {
    return <SwipeListView
      data={this.props.tags}
      renderItem={this.renderTag}
      renderHiddenItem={ (data, rowMap) => <TrashButton onPress={() => this.deleteTag(data.item)} />}
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
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginTop: 5,
    marginLeft: 20,
    width: 50,
  },
})

TagsList.propTypes = {
  tags: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    tags: selectors.sortedTagsSelector(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.tagActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagsList)
