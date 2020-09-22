import React, { useState } from 'react'
import t from 'format-message'
import { View, Input, Label, Item, Text, Button } from 'native-base'
import { StyleSheet } from 'react-native'
import AttachmentList from '../../shared/attachments/AttachmentList'
import { DetailsWrapper, DetailsLeft, DetailsRight } from '../shared/Details'

export default function Note (props) {
  const { note } = props
  const [title, setTitle] = useState(note.title)
  const [changes, makeChanges] = useState(false)

  const saveChanges = () => {
    // TODO: save content as well
    props.onSave(note.id, title)
    makeChanges(false)
  }

  const renderAttachments = () => {
    return <AttachmentList
      itemType='note'
      item={note}
      navigate={props.navigation.navigate}
      books
    />
  }

  return <DetailsWrapper>
    <DetailsLeft>
      <Item inlineLabel style={styles.label}>
        <Label>{t('Title')}</Label>
        <Input
          value={title}
          onChangeText={text => {
            setTitle(text)
            makeChanges(true)
          }}
          autoCapitalize='sentences'
        />
      </Item>
      <Item inlineLabel last regular style={[styles.label]}>
        <Label>{t('Content')}{' RCE'}</Label>
      </Item>
    </DetailsLeft>
    <DetailsRight>
      <View>
        <View style={styles.detailsRightItems}>
          { renderAttachments() }
        </View>
      </View>
      <View style={styles.buttonFooter}>
        <Button block success disabled={!changes} onPress={saveChanges}><Text>{t('Save')}</Text></Button>
      </View>
    </DetailsRight>
  </DetailsWrapper>
}

const styles = StyleSheet.create({
  buttonFooter: {
    marginTop: 16,
    marginRight: 16,
    marginBottom: 8,
  },
  label: {
    marginBottom: 16,
  },
  detailsRightItems: {
    paddingRight: 8,
  },
})