import React from 'react'
import { StyleSheet, Dimensions, TouchableHighlight } from 'react-native'
import { View, Text, Button, H1 } from 'native-base'
import { isTablet } from 'react-native-device-info'
import t from 'format-message'

const bookWidth = isTablet() ? (Dimensions.get('window').width * 3/16) : (Dimensions.get('window').width * 9/16)

export default function Book (props) {
  const { book } = props
  return <TouchableHighlight onPress={() => props.navigateToOutline(book.id)}>
    <View style={styles.cardView}>
      <View style={styles.backbone}/>
      <View style={styles.card}>
        <H1 style={styles.bookTitle}>{book.title || t('Untitled')}</H1>
        <View style={styles.footer}>
          <Button light onPress={() => props.navigateToDetails(book.id)} style={styles.buttons}><Text>{t('Edit')}</Text></Button>
          <Button light onPress={() => props.navigateToOutline(book.id)} style={styles.buttons}><Text>{t('Outline')}</Text></Button>
        </View>
      </View>
    </View>
  </TouchableHighlight>
}

const styles = StyleSheet.create({
  bookTitle: {
    marginTop: 8,
    textAlign: 'center',
  },
  cardView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    height: 300,
    width: bookWidth,
    marginLeft: -6,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: 4,
    borderColor: '#62B1F6', // same color as info buttons
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  backbone: {
    width: 20,
    height: 300,
    backgroundColor: '#62B1F6', // same color as info buttons
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-around',
  },
  buttons: {
    backgroundColor: '#F4F4F4',
  },
})