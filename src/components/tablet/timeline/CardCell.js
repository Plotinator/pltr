import React, { Component } from 'react'
import { View, Text } from 'native-base'
import tinycolor from 'tinycolor2'
import { StyleSheet } from 'react-native'
import { Cell } from '../../ui/Cell'
import CardModal from './CardModal'

export class CardCell extends Component {
  state = {showModal: false}

  showCardModal = () => {
    this.setState({showModal: true})
  }

  renderModal () {
    if (!this.state.showModal) return null

    return <CardModal card={this.props.card} navigation={this.props.navigation} onClose={() => this.setState({showModal: false})}/>
  }

  render () {
    const { color, card } = this.props
    const colorObj = tinycolor(color)
    const borderColor = {borderColor: colorObj.toHexString()}
    return <Cell style={styles.cell} onPress={this.showCardModal}>
      <View style={[styles.coloredLine, borderColor]}/>
      <View style={[styles.cardBox, borderColor]} elevation={5}>
        <Text style={styles.cardText}>{card.title}</Text>
      </View>
      { this.renderModal() }
    </Cell>
  }
}

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
  },
  coloredLine: {
    width: '100%',
    borderWidth: 1,
    position: 'absolute',
    top: 45,
  },
  cardBox: {
    position: 'absolute',
    left: 29, // 25 +4 for borders
    width: 100,
    height: 62,
    backgroundColor: 'hsl(210, 36%, 96%)', //gray-9
    borderWidth: 2,
    borderRadius: 4,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    flexShrink: 1,
  },
})
