import React from 'react'
import { StyleSheet, Modal } from 'react-native'
import { View, Text, Button, Icon, H3, } from 'native-base'
import { DetailsWrapper, DetailsLeft, DetailsRight } from './Details'
import ColorPickerList from '../../shared/ColorPickerList'
import tinycolor from 'tinycolor2'
import t from 'format-message'

export default function ColorPickerModal (props) {

  const color = tinycolor(props.currentColor)
  const currentBackground = {backgroundColor: color.toHexString()}

  return <Modal visible={true} animationType='slide' transparent={true} onDismiss={props.onClose} onRequestClose={props.onClose}>
    <View style={styles.centered} elevation={10}>
      <View style={styles.contentWrapper}>
        <DetailsWrapper>
          <DetailsLeft>
            <ColorPickerList chooseColor={props.chooseColor}/>
          </DetailsLeft>
          <DetailsRight>
            <View>
              <View style={styles.buttonWrapper}>
                <Button rounded light style={styles.button} onPress={props.onClose}><Icon type='FontAwesome5' name='times'/></Button>
              </View>
              <View style={styles.formRightItems}>
                <View style={styles.currentColorWrapper}>
                  <H3>{t('Current Color')}</H3>
                  <View style={[styles.colorSwatch, currentBackground]}/>
                </View>
              </View>
            </View>
            <View style={styles.buttonFooter}>
            </View>
          </DetailsRight>
        </DetailsWrapper>
      </View>
    </View>
  </Modal>
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  contentWrapper: {
    width: '85%',
    height: '80%',
  },
  button: {
    // backgroundColor: '#f4f4f4',
    backgroundColor: 'white',
    borderColor: '#f4f4f4',
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
  formRightItems: {
    paddingRight: 8,
  },
  currentColorWrapper: {
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSwatch: {
    width: 60,
    height: 50,
    margin: 8,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
  }
})
