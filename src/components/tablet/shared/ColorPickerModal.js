import React from 'react'
import { StyleSheet, Modal } from 'react-native'
import { View, Text, Button, Icon, H3 } from 'native-base'
import { DetailsWrapper, DetailsLeft, DetailsRight } from './Details'
import ColorPickerList from '../../shared/ColorPickerList'
import tinycolor from 'tinycolor2'
import t from 'format-message'
import Metrics from '../../../utils/Metrics'

export default function ColorPickerModal (props) {
  const { expressMode, currentColor, onClose, chooseColor } = props
  const color = tinycolor(currentColor)
  const currentBackground = { backgroundColor: color.toHexString() }
  return (
    <View
      style={styles.modal}
      visible
      animationType='slide'
      transparent
      onDismiss={onClose}
      onRequestClose={onClose}>
      <View style={styles.centered} elevation={10}>
        <View
          style={expressMode ? styles.expressWrapper : styles.contentWrapper}>
          <DetailsWrapper>
            <DetailsLeft>
              <ColorPickerList chooseColor={chooseColor} />
            </DetailsLeft>
            <DetailsRight>
              <View>
                <View style={styles.buttonWrapper}>
                  <Button rounded light style={styles.button} onPress={onClose}>
                    <Icon type='FontAwesome5' name='times' />
                  </Button>
                </View>
                <View style={styles.formRightItems}>
                  <View style={styles.currentColorWrapper}>
                    <H3 style={expressMode && styles.currentTitle}>
                      {t('Current Color')}
                    </H3>
                    <View style={[styles.colorSwatch, currentBackground]} />
                  </View>
                </View>
              </View>
              <View style={styles.buttonFooter} />
            </DetailsRight>
          </DetailsWrapper>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10
  },
  contentWrapper: {
    width: '85%',
    height: '80%'
  },
  expressWrapper: {
    width: '100%',
    height: '80%'
  },
  button: {
    margin: 10,
    // backgroundColor: '#f4f4f4',
    backgroundColor: 'white',
    borderColor: '#f4f4f4'
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%'
  },
  buttonFooter: {
    marginTop: 16,
    marginRight: 16,
    marginBottom: 8
  },
  formRightItems: {
    paddingRight: 8
  },
  currentColorWrapper: {
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  colorSwatch: {
    width: 60,
    height: 50,
    margin: 8,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10
  },
  currentTitle: {
    fontSize: 10,
    lineHeight: 10,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  modal: {
    position: 'absolute',
    zIndex: 9,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
})
