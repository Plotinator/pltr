import React, { useState, useEffect } from 'react'
import t from 'format-message'
import { View, Left, Right, Icon, Badge, Text, List, ListItem } from 'native-base'
import { StyleSheet } from 'react-native'
import { attachmentItemText } from '../../../utils/attachment_titles'

const defaultAttachments = ['characters', 'places', 'tags']

export default function AttachmentList (props) {
  const { item, itemType, navigate, only, books } = props
  const [attachments, setAttachments] = useState(only || defaultAttachments)

  useEffect(() => {
    if (books && !attachments.includes('bookIds')) {
      setAttachments(state => ['bookIds', ...state])
    }
  }, [books])

  const navigateToAttachmentSelector = (type) => {
    navigate('AttachmentSelectorModal', {item, itemType, type})
  }

  const renderAttachments = () => {
    return attachments.map(type => {
      return <ListItem key={type} button onPress={() => navigateToAttachmentSelector(type)}>
        <Left>
          <Badge info style={styles.badge}><Text>{item[type].length}</Text></Badge>
          <Text>{attachmentItemText(type)}</Text>
        </Left>
        <Right>
          <Icon type='FontAwesome5' name='chevron-right'/>
        </Right>
      </ListItem>
    })
  }

  return <View>
    <List>
      { renderAttachments() }
    </List>
  </View>
}

const styles = StyleSheet.create({
  badge: {
    marginRight: 8,
  }
})
