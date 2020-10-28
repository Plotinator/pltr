import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ScrollView, StyleSheet } from 'react-native'
import { View, Text, H1, Form, Button, Icon, Input, Label, Item } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { actions } from 'pltr/v2'
import Toolbar from '../shared/Toolbar'
import t from 'format-message'
import { getVersion } from 'react-native-device-info'
import Book from '../../shared/project/Book'
import DrawerButton from '../../ui/DrawerButton'

class Project extends Component {
  state = {}
  static getDerivedStateFromProps (props, state) {
    if (state.changes) {
      return {series: state.series, changes: true}
    } else {
      return {series: props.series, changes: false}
    }
  }

  saveChanges = () => {
    this.props.seriesActions.editSeries({...this.state.series})
    this.setState({changes: false})
  }

  openEditModal = (id) => {
    // this.props.navigation.push('SeriesDetails', { id })
  }

  navigateToTimeline = (id) => {
    this.props.uiActions.changeCurrentTimeline(id)
    this.props.navigation.navigate('Timeline')
  }

  renderBooks () {
    const { books } = this.props
    if (!books.allIds) return null

    return books.allIds.map(id => {
      return <Book key={id} book={books[`${id}`]} navigateToOutline={this.navigateToTimeline} navigateToDetails={this.openEditModal} />
    })
  }

  render () {
    const { series, changes } = this.state
    return <View style={{flex: 1}}>
      <Toolbar>
        <DrawerButton openDrawer={this.props.openDrawer} />
      </Toolbar>
      <View style={styles.seriesWrapper}>
        <H1>{t('Series')}</H1>
        <Grid>
          <Row style={styles.row}>
            <Col size={6} style={styles.column}>
              <Item inlineLabel style={styles.label}>
                <Label>{t('Name')}</Label>
                <Input
                  value={series.name}
                  onChangeText={text => this.setState({series: {...series, name: text}, changes: true})}
                  autoCapitalize='words'
                />
              </Item>
            </Col>
            <Col size={6} style={styles.column}>
              <Item inlineLabel style={styles.label}>
                <Label>{t('Premise')}</Label>
                <Input
                  value={series.premise}
                  onChangeText={text => this.setState({series: {...series, premise: text}, changes: true})}
                  autoCapitalize='sentences'
                />
              </Item>
            </Col>
          </Row>
          <Row style={styles.row}>
            <Col size={6} style={styles.column}>
              <Item inlineLabel style={styles.label}>
                <Label>{t('Genre')}</Label>
                <Input
                  value={series.genre}
                  onChangeText={text => this.setState({series: {...series, genre: text}, changes: true})}
                  autoCapitalize='sentences'
                />
              </Item>
            </Col>
            <Col size={6} style={styles.column}>
              <Item inlineLabel style={styles.label}>
                <Label>{t('Theme')}</Label>
                <Input
                  value={series.theme}
                  onChangeText={text => this.setState({series: {...series, theme: text}, changes: true})}
                  autoCapitalize='sentences'
                />
              </Item>
            </Col>
          </Row>
          <Row>
            <Col size={12} style={styles.saveColumn}>
              <Button success disabled={!changes} onPress={this.saveChanges}><Text>{t('Save')}</Text></Button>
            </Col>
          </Row>
        </Grid>
      </View>
      <View style={styles.booksWrapper}>
        <H1>{t('Books')}</H1>
        <ScrollView contentContainerStyle={styles.booksList}>
          { this.renderBooks() }
        </ScrollView>
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: 'hsl(211, 27%, 70%)', //gray-6
    marginRight: 16,
  },
  text: {
    color: 'hsl(209, 61%, 16%)', //gray-0
  },
  icon: {
    color: 'hsl(209, 61%, 16%)', //gray-0
  },
  seriesWrapper: {
    flex: 1,
    padding: 16,
  },
  booksWrapper: {
    flex: 2,
    padding: 16,
  },
  label: {
    // marginBottom: 16,
    backgroundColor: 'white',
    padding: 2,
  },
  row: {
    height: 70,
  },
  column: {
    padding: 8,
  },
  saveColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  booksList: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignContent: 'flex-start'
  },
})

Project.propTypes = {
  series: PropTypes.object.isRequired,
  books: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  seriesActions: PropTypes.object.isRequired,
  uiActions: PropTypes.object.isRequired,
  closeFile: PropTypes.func,
}

function mapStateToProps (state) {
  return {
    series: state.series,
    books: state.books,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.bookActions, dispatch),
    seriesActions: bindActionCreators(actions.seriesActions, dispatch),
    uiActions: bindActionCreators(actions.uiActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Project)