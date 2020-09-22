import React, { Component } from 'react'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ScrollView, StyleSheet, Linking } from 'react-native'
import { View, Text, H1, Form, Button, Icon, Input, Label, Item } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { actions } from 'pltr/v2'
import Toolbar from '../shared/Toolbar'
import t from 'format-message'
import { getVersion } from 'react-native-device-info'
import Book from '../../shared/project/Book'

class Project extends Component {

  goToDocs = () => {
    Linking.openURL('https://getplottr.com/docs')
  }

  goToHelp = () => {
    Linking.openURL('https://getplottr.com/support')
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
    return books.allIds.map(id => {
      return <Book book={books[`${id}`]} navigateToOutline={this.navigateToTimeline} navigateToDetails={this.openEditModal} />
    })
  }

  render () {
    console.log('CLOSE FILE', this.props.closeFile)
    const { series, closeFile } = this.props
    return <View style={{flex: 1}}>
      <Toolbar>
        <Button iconLeft bordered style={styles.button} onPress={this.props.closeFile}><Icon type='FontAwesome5' name='times-circle' style={styles.icon}/><Text style={styles.text}>{t('Close File')}</Text></Button>
        <Button iconLeft bordered style={styles.button} onPress={this.goToDocs}><Icon type='FontAwesome5' name='book-open' style={styles.icon}/><Text style={styles.text}>{t('Documentation')}</Text></Button>
        <Button iconLeft bordered style={styles.button} onPress={this.goToHelp}><Icon type='FontAwesome5' name='life-ring' style={styles.icon}/><Text style={styles.text}>{t('Help')}</Text></Button>
        <View style={styles.versionWrapper}>
          <Text style={styles.versionText}>{`App Version: ${getVersion()}`}</Text>
        </View>
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
                  onChangeText={text => {}}
                  autoCapitalize='words'
                />
              </Item>
            </Col>
            <Col size={6} style={styles.column}>
              <Item inlineLabel style={styles.label}>
                <Label>{t('Premise')}</Label>
                <Input
                  value={series.premise}
                  onChangeText={text => {}}
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
                  onChangeText={text => {}}
                  autoCapitalize='sentences'
                />
              </Item>
            </Col>
            <Col size={6} style={styles.column}>
              <Item inlineLabel style={styles.label}>
                <Label>{t('Theme')}</Label>
                <Input
                  value={series.theme}
                  onChangeText={text => {}}
                  autoCapitalize='sentences'
                />
              </Item>
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
  versionWrapper: {
    marginLeft: 'auto',
  },
  versionText: {
    color: 'hsl(209, 34%, 20%)', //gray-2
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