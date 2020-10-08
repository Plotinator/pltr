import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'pltr/v2'
import { StyleSheet, View, LayoutAnimation, Platform, UIManager } from 'react-native'
import { Icon, H3, Item, Input, Button, Label, Container, Content, Text, ListItem, Left, Right, Badge } from 'native-base'
import { SwipeListView } from 'react-native-swipe-list-view'
import t from 'format-message'
import TrashButton from '../../ui/TrashButton'
import { askToDelete } from '../../../utils/delete'

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

class PlotlinesScreen extends Component {
  state = {text: ''}

  navigateToDetails = (line) => {
    const { isSeries } = this.props
    this.props.navigation.navigate('PlotlineDetails', { line, isSeries })
  }

  add = () => {
    const { text } = this.state
    const { bookId, actions, seriesLineActions, isSeries } = this.props
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    if (isSeries) {
      seriesLineActions.addLineWithTitle(text)
    } else {
      actions.addLineWithTitle(text, bookId)
    }
    this.setState({text: ''})
  }

  delete = (line) => {
    const { bookId, actions, seriesLineActions, isSeries } = this.props
    if (isSeries) {
      askToDelete(line.title, () => seriesLineActions.deleteLine(line.id))
    } else {
      askToDelete(line.title, () => actions.deleteLine(line.id, bookId))
    }
  }

  renderItem = ({ item }) => {
    return <ListItem noIndent button style={styles.row} onPress={() => this.navigateToDetails(item)}>
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
          <Button full success disabled={!this.state.text} onPress={this.add}><Text>{t('Add')}</Text></Button>
          <SwipeListView
            data={this.props.lines}
            keyExtractor={(item) => item.id.toString()}
            renderItem={this.renderItem}
            renderHiddenItem={ (data, rowMap) => <TrashButton onPress={() => this.delete(data.item)} />}
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

PlotlinesScreen.propTypes = {
  lines: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state, ownProps) {
  return {
    lines: selectors.sortedLinesByBookSelector(state),
    bookId: selectors.currentTimelineSelector(state),
    isSeries: selectors.isSeriesSelector(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.lineActions, dispatch),
    seriesLineActions: bindActionCreators(actions.seriesLineActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlotlinesScreen)
