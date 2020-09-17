import { cloneDeep } from 'lodash'
import React, { useState } from 'react'
import t from 'format-message'
import { View, Form, Input, Label, Item, Text, Button } from 'native-base'
import { actions, selectors, initialState } from 'pltr/v2'
import { StyleSheet, ScrollView } from 'react-native'
import AttachmentList from '../../shared/attachments/AttachmentList'

export default function Note (props) {
  const { note } = props
  const [title, setTitle] = useState(note.title)

  console.log('NOTE', title)

  const renderAttachments = () => {
    return <AttachmentList
      itemType='note'
      item={note}
      navigate={props.navigation.navigate}
      books
    />
  }

  return <View style={styles.noteDetails}>
    <View style={styles.noteInner}>
      <View style={styles.contentWrapper}>
        <View style={styles.content} >
          <Form style={styles.form}>
            <View style={styles.formLeft}>
              <Item inlineLabel last style={styles.label}>
                <Label>{t('Title')}</Label>
                <Input
                  value={title}
                  onChangeText={text => setText(text)}
                  autoCapitalize='sentences'
                />
              </Item>
              <Item inlineLabel last regular style={[styles.label]}>
                <Label>{t('Content')}</Label>
              </Item>
            </View>
            <View style={styles.formRight}>
              <View style={styles.formRightInner}>
                <View>
                  <View style={styles.formRightItems}>
                    { renderAttachments() }
                  </View>
                </View>
                <View style={styles.buttonFooter}>
                  <Button block success onPress={this.saveChanges}><Text>{t('Save')}</Text></Button>
                </View>
              </View>
            </View>
          </Form>
        </View>
      </View>
    </View>
  </View>
}

const styles = StyleSheet.create({
  noteDetails: {
    padding: 16,
  },
  noteInner: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  contentWrapper: {
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  buttonFooter: {
    marginTop: 16,
    marginRight: 16,
    marginBottom: 8,
  },
  button: {
    // backgroundColor: '#f4f4f4',
    backgroundColor: 'white',
    borderColor: '#f4f4f4',
  },
  content: {
    flex: 1,
  },
  label: {
    marginBottom: 16,
  },
  form: {
    flex: 1,
    flexDirection: 'row',
  },
  formRight: {
    flex: 0.25,
    paddingLeft: 8,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'hsl(210, 36%, 96%)', //gray-9
  },
  formRightInner: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  formRightItems: {
    paddingRight: 8,
  },
  formLeft: {
    flex: 0.75,
    paddingHorizontal: 16,
  },
  content: {
    padding: 16,
  },
  label: {
    marginBottom: 16,
  },
  badge: {
    marginRight: 8,
  }
})