import React from 'react'
import i18n from 'format-message'
import { View, Left, Right, Icon, Badge, Text, List, ListItem } from 'native-base'
import { StyleSheet } from 'react-native'

export default function AttachmentList (props) {
  const { item, itemType, navigate } = props

  const navigateToAttachmentSelector = (type, selectedIds) => {
    navigate('AttachmentSelectorModal', {item, itemType, type, selectedIds})
  }

  return <View>
    <List>
      <ListItem button onPress={() => navigateToAttachmentSelector('characters', item.characters)}>
        <Left>
          <Badge style={styles.badge} info><Text>{item.characters.length}</Text></Badge>
          <Text>{i18n('Characters')}</Text>
        </Left>
        <Right>
          <Icon type='FontAwesome5' name='chevron-right'/>
        </Right>
      </ListItem>
      <ListItem button onPress={() => navigateToAttachmentSelector('places', item.places)}>
        <Left>
          <Badge style={styles.badge} info><Text>{item.places.length}</Text></Badge>
          <Text>{i18n('Places')}</Text>
        </Left>
        <Right>
          <Icon type='FontAwesome5' name='chevron-right'/>
        </Right>
      </ListItem>
      <ListItem button onPress={() => navigateToAttachmentSelector('tags', item.tags)}>
        <Left>
          <Badge style={styles.badge} info><Text>{item.tags.length}</Text></Badge>
          <Text>{i18n('Tags')}</Text>
        </Left>
        <Right>
          <Icon type='FontAwesome5' name='chevron-right'/>
        </Right>
      </ListItem>
    </List>
  </View>
}

const styles = StyleSheet.create({
  badge: {
    marginRight: 8,
  }
})
