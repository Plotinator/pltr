import React from 'react'
import i18n from 'format-message'
import { View, Left, Right, Icon, Badge, Text, List, ListItem } from 'native-base'
import { StyleSheet } from 'react-native'
import { attachmentItemText } from '../../../utils/attachment_titles'

const defaultAttachments = ['characters', 'places', 'tags']

export default function AttachmentList (props) {
  const { item, itemType, navigate, only, books } = props
  let attachments = only || defaultAttachments
  if (books) attachments.unshift('bookIds')

  const navigateToAttachmentSelector = (type, selectedIds) => {
    navigate('AttachmentSelectorModal', {item, itemType, type, selectedIds})
  }

  const renderAttachments = () => {
    return attachments.map(type => {
      return <ListItem key={type} button onPress={() => navigateToAttachmentSelector(type, item[type])}>
        <Left>
          <Badge style={styles.badge} info><Text>{item[type].length}</Text></Badge>
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
