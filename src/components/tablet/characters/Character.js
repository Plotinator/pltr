import React, { useState } from 'react'
import t from 'format-message'
import { View, Input, Label, Item, Text, Button } from 'native-base'
import { StyleSheet, ScrollView } from 'react-native'
import AttachmentList from '../../shared/attachments/AttachmentList'
import { DetailsWrapper, DetailsLeft, DetailsRight } from '../shared/Details'

export default function Character (props) {
  const { character, customAttributes } = props
  const [changes, makeChanges] = useState(false)
  const [workingCopy, setWorkingCopy] = useState(character)
  let customAttrs = customAttributes.reduce((acc, attr) => {
    acc[attr.name] = character[attr.name]
    return acc
  }, {})
  const [workingCA, setWorkingCA] = useState(customAttrs)

  const saveChanges = () => {
    // TODO: save notes as well
    const values = {
      name: workingCopy.name,
      description: workingCopy.description,
      templates: workingCopy.templates,
      ...workingCA,
    }
    props.onSave(character.id, values)
    makeChanges(false)
  }

  updateTemplateValue = (tId, attr, newValue) => {
    const newTemplates = workingCopy.templates.map(t => {
      if (t.id == tId) {
        t.attributes = t.attributes.map(at => {
          if (at.name == attr) {
            at.value == newValue
          } else {
            return at
          }
        })
      } else {
        return t
      }
    })

    setWorkingCopy({...workingCopy, templates: newTemplates})
    makeChanges(true)
  }

  const renderTemplates = () => {
    return workingCopy.templates.flatMap(t => {
      return t.attributes.map(attr => {
        if (attr.type == 'paragraph') {
          return <Item key={attr.name} inlineLabel last regular style={styles.label}>
            <Label>{attr.name}{' RCE'}</Label>
          </Item>
        } else {
          return <Item key={attr.name} inlineLabel style={styles.label}>
            <Label>{attr.name}</Label>
            <Input
              value={attr.value}
              onChangeText={text => updateTemplateValue(t.id, attr.name, text)}
              autoCapitalize='sentences'
            />
          </Item>
        }
      })
    })
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
      itemType='character'
      item={character}
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
      { renderTemplates() }
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
