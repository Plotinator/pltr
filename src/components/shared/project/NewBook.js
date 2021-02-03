import React from 'react'
import { View, ImageBackground } from 'react-native'
import t from 'format-message'
import { Text, ShellButton } from '../../shared/common'
import styles from './NewBookStyles'
import Images from '../../../images'

const { BOOK } = Images

export default function NewBook(props) {
  const {
    editable,
    book: { id, title },
    style,
    navigateToOutline
  } = props
  const goToBook = () => {
    navigateToOutline(id)
  }
  const editBook = () => {
    navigateToDetails(id)
  }
  const bookStyles = [styles.book, style]

  return (
    <ShellButton onPress={goToBook} style={bookStyles}>
      <ImageBackground
        source={BOOK}
        style={styles.bookImage}
        resizeMode='contain'>
        <View style={styles.titleWrapper}>
          <Text
            fontSize='small'
            fontStyle='bold'
            style={styles.bookTitle}
            center>
            {title || t('Untitled')}
          </Text>
        </View>
        <View style={[styles.actions, !editable && styles.centerButtons]}>
          {editable && (
            <ShellButton onPress={editBook} style={styles.button}>
              <Text fontSize='tiny' fontStyle='semiBold'>
                {t('Edit')}
              </Text>
            </ShellButton>
          )}
          <ShellButton onPress={goToBook} style={styles.button}>
            <Text fontSize='tiny' fontStyle='semiBold'>
              {t('Outline')}
            </Text>
          </ShellButton>
        </View>
      </ImageBackground>
    </ShellButton>
  )
}
