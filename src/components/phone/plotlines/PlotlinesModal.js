import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'pltr/v2'
import { StyleSheet, View, LayoutAnimation, Platform } from 'react-native'
import { Icon, H3, Item, Input, Button, Label, Container, Content, Text, ListItem, Left, Right, Badge } from 'native-base'
import { SwipeListView } from 'react-native-swipe-list-view'
import t from 'format-message'
import TrashButton from '../../ui/TrashButton'

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

class PlotlinesModal extends Component {
  state = {text: ''}

  navigateToDetails = (id) => {
    this.props.navigation.navigate('PlotlineDetails', { id })
  }

  add = () => {
    const { text } = this.state
    const { bookId, actions } = this.props
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    actions.addLineWithTitle(text, bookId)
    this.setState({text: ''})
  }

  delete = (id) => {
    const { bookId, actions } = this.props
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    actions.deleteLine(id, bookId)
  }

  renderItem = ({ item }) => {
    return <ListItem noIndent button style={styles.row} onPress={() => this.navigateToDetails(item.id)}>
      <Left>
        <View style={styles.rowView}>
          <H3 style={styles.title}>{item.title || t('New Plotline')}</H3>
          <Badge style={[styles.badge, {backgroundColor: item.color}]}><Text>{item.color}</Text></Badge>
        </View>
      </Left>
      <Right>
        <Icon type='FontAwesome5' name='chevron-right'/>
      </Right>
    </ListItem>
  }

  render () {
    return <Container>
      <Content padder>
        <View style={styles.container}>
          <Item floatingLabel>
            <Label>{t('New Plotline')}</Label>
            <Input value={this.state.text} onChangeText={text => this.setState({text})}/>
          </Item>
          <Button full success onPress={this.add}><Text>{t('Add')}</Text></Button>
          <SwipeListView
            data={this.props.lines}
            keyExtractor={(item) => item.id.toString()}
            renderItem={this.renderItem}
            renderHiddenItem={ (data, rowMap) => <TrashButton onPress={() => this.deleteAttr(data.item.id)} />}
            leftOpenValue={75}
          />
        </View>
      </Content>
    </Container>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
  },
  row: {
    backgroundColor: 'white',
  },
  hiddenRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  },
})

PlotlinesModal.propTypes = {
  lines: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state, ownProps) {
  return {
    lines: selectors.sortedLinesByBookSelector(state),
    bookId: selectors.currentTimelineSelector(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.lineActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlotlinesModal)
