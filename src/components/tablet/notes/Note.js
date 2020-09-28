import React, { useState } from 'react'
import t from 'format-message'
import { View, Input, Label, Item, Text, Button, Image } from 'native-base'
import { StyleSheet } from 'react-native'
import AttachmentList from '../../shared/attachments/AttachmentList'
import { DetailsWrapper, DetailsLeft, DetailsRight } from '../shared/Details'
import RichTextEditor from '../../ui/RichTextEditor'

export default function Note (props) {
  const { note } = props
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
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
    <DetailsLeft contentContainerStyle={{flex: 1}}>
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
      <View style={[styles.afterList, { flex: 1 }]}>
        <Label>{t('Content')}</Label>
        <RichTextEditor
          initialValue={note.content}
          onChange={val => {
            setContent(val)
            makeChanges(true)
          }}
        />
      </View>
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
