import React from 'react'
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { View, H2 } from 'native-base'
import { isTablet } from 'react-native-device-info'
import t from 'format-message'
import { Text, Button } from '../../shared/common'

const bookWidth = isTablet()
  ? (Dimensions.get('window').width * 3) / 16
  : (Dimensions.get('window').width * 9) / 16

export default function Book (props) {
  const { book } = props
  return (
    <TouchableOpacity onPress={() => props.navigateToOutline(book.id)}>
      <View style={styles.cardView}>
        <View style={styles.backbone} />
        <View style={styles.card}>
          <Text fontSize='h3' fontStyle='semiBold' style={styles.bookTitle}>
            {book.title || t('Untitled')}
          </Text>
          <View style={styles.footer}>
            {isTablet() ? null : (
              <Button
                tight
                onPress={() => props.navigateToDetails(book.id)}
                style={styles.buttons}>
                <Text fontSize='h5'>{t('Edit')}</Text>
              </Button>
            )}
            <Button
              tight
              onPress={() => props.navigateToOutline(book.id)}
              style={styles.buttons}>
              <Text fontSize='h5'>{t('Outline')}</Text>
            </Button>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  bookTitle: {
    marginTop: 25,
    textAlign: 'center'
  },
  cardView: {
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 16
  },
  card: {
    height: 300,
    width: bookWidth,
    marginLeft: -6,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: 4,
    borderColor: '#62B1F6', // same color as info buttons
    backgroundColor: 'white',
    justifyContent: 'space-between'
  },
  backbone: {
    width: 20,
    height: 300,
    backgroundColor: '#62B1F6', // same color as info buttons
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingBottom: 25,
    justifyContent: 'space-around'
  },
  buttons: {
    backgroundColor: '#F4F4F4'
  }
})
