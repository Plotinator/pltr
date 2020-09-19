import React, { useState } from 'react'
import t from 'format-message'
import { View, Input, Label, Item, Text, Button } from 'native-base'
import { StyleSheet } from 'react-native'
import AttachmentList from '../../shared/attachments/AttachmentList'
import { DetailsWrapper, DetailsLeft, DetailsRight } from '../shared/Details'

export default function Place (props) {
  const { place, customAttributes } = props
  const [changes, makeChanges] = useState(false)
  const [workingCopy, setWorkingCopy] = useState(place)
  let customAttrs = customAttributes.reduce((acc, attr) => {
    acc[attr.name] = place[attr.name]
    return acc
  }, {})
  const [workingCA, setWorkingCA] = useState(customAttrs)

  const saveChanges = () => {
    // TODO: save notes as well
    const values = {
      name: workingCopy.name,
      description: workingCopy.description,
      ...workingCA,
    }
    props.onSave(place.id, values)
    makeChanges(false)
  }

  const renderCustomAttributes = () => {
    return customAttributes.map((attr, idx) => {
      const { name, type } = attr
      if (type == 'paragraph') {
        return <Item key={idx} inlineLabel last regular style={styles.label}>
          <Label>{name}{' RCE'}</Label>
        </Item>
      } else {
        return <Item key={idx} inlineLabel style={styles.label}>
          <Label>{name}</Label>
          <Input
            value={workingCA[name]}
            onChangeText={text => {
              setWorkingCA({...workingCA, [name]: text})
              makeChanges(true)
            }}
            autoCapitalize='sentences'
          />
        </Item>
      }
    })
  }

  const renderAttachments = () => {
    return <AttachmentList
      itemType='place'
      item={place}
      navigate={props.navigation.navigate}
      only={['bookIds', 'tags']}
    />
  }

  return <DetailsWrapper>
    <DetailsLeft>
      <Item inlineLabel style={styles.label}>
        <Label>{t('Name')}</Label>
        <Input
          value={workingCopy.name}
          onChangeText={text => {
            setWorkingCopy({...workingCopy, name: text})
            makeChanges(true)
          }}
          autoCapitalize='words'
        />
      </Item>
      <Item inlineLabel style={styles.label}>
        <Label>{t('Description')}</Label>
        <Input
          value={workingCopy.description}
          onChangeText={text => {
            setWorkingCopy({...workingCopy, description: text})
            makeChanges(true)
          }}
          autoCapitalize='sentences'
        />
      </Item>
      <Item inlineLabel last regular style={[styles.label, styles.afterList]}>
        <Label>{t('Notes')}{' RCE'}</Label>
      </Item>
      { renderCustomAttributes() }
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
  afterList: {
    marginTop: 16,
  },
  detailsRightItems: {
    paddingRight: 8,
  },
})
