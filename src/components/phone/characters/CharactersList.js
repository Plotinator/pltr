import { sortBy } from 'lodash'
import React, { Component } from 'react'
import { SwipeListView } from 'react-native-swipe-list-view'
import { StyleSheet, Animated, SectionList } from 'react-native'
import { DefaultTheme } from '@react-navigation/native'
import PropTypes from 'react-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'pltr/v2'
import { View, ListItem, Icon, Left, Right, H3, Text, Button, H1, Fab, Container, Content, Body } from 'native-base'
import i18n from 'format-message'

class CharactersList extends Component {
  state = { data: [] }

  static getDerivedStateFromProps (props, state) {
    let categories = [...props.categories]
    categories.push({id: null, name: i18n('Uncategorized')})

    const data = categories.map(cat => {
      let characters = []
      if (props.visibleCharactersByCategory[`${cat.id}`]) {
        characters = props.visibleCharactersByCategory[`${cat.id}`].map(ch => ch)
      }
      return {
        title: cat.name,
        data: characters,
      }
    })

    return { data }
  }

  deleteCharacter = (id) => {
    this.props.actions.deleteCharacter(id)
  }

  navigateToDetails = (character) => {
    this.props.navigation.navigate('CharacterDetails', { character })
  }

  renderCharacter = ({item}) => {
    return <ListItem noIndent button style={styles.row} onPress={() => this.navigateToDetails(item)}>
      <Left>
        <H3 style={styles.title}>{item.name || i18n('New Character')}</H3>
      </Left>
      <Right>
        <Icon type='FontAwesome5' name='chevron-right'/>
      </Right>
    </ListItem>
  }

  renderSectionHeader = ({section}) => {
    if (!section.data.length) return null

    return <H1 style={styles.sectionHeader}>{section.title}</H1>
  }

  render () {
    return <SectionList
      sections={this.state.data}
      renderSectionHeader={this.renderSectionHeader}
      renderItem={this.renderCharacter}
      keyExtractor={item => item.id}
      ListEmptyComponent={<H1>{i18n('No Characters')}</H1>}
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
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: DefaultTheme.colors.background,
  },
})

CharactersList.propTypes = {
  visibleCharactersByCategory: PropTypes.object.isRequired,
  characters: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  customAttributes: PropTypes.array.isRequired,
  customAttributesThatCanChange: PropTypes.array,
  ui: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    visibleCharactersByCategory: selectors.visibleSortedCharactersByCategorySelector(state),
    filterIsEmpty: selectors.characterFilterIsEmptySelector(state),
    characters: state.characters,
    categories: selectors.sortedCharacterCategoriesSelector(state),
    customAttributes: state.customAttributes.characters,
    customAttributesThatCanChange: selectors.characterCustomAttributesThatCanChangeSelector(state),
    ui: state.ui,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.characterActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CharactersList)