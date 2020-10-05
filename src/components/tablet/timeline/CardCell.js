import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { View, Text, Button, Icon } from 'native-base'
import tinycolor from 'tinycolor2'
import { StyleSheet, PanResponder, Animated, TouchableOpacity } from 'react-native'
import Cell from '../shared/Cell'
import CardModal from './CardModal'
import { useRegisterCoordinates } from './hooks'

export default function CardCell (props) {
  const [showModal, setModal] = useState(false)
  const [pan, setPan] = useState(new Animated.ValueXY())
  const [panResponder, setResponder] = useState(null)
  const [cellRef, measure] = useRegisterCoordinates(props.register, props.card.chapterId, props.card.lineId, false)
  useLayoutEffect(() => {
    // Initialize PanResponder with move handling
    resp = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderMove: Animated.event([
        null, { dx: pan.x, dy: pan.y }
      ], {useNativeDriver: false}),
      onPanResponderRelease: (e, gesture) => {
        if (!props.handleDrop(gesture.moveX, gesture.moveY, props.card)) {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start()
        }
      },
    })
    setResponder(resp)
  }, [])

  useEffect(() => {
    // Add a listener for the delta value change
    // let _val = { x:0, y:0 }
    // let listenerId = pan.addListener((value) => _val = value);
    // adjusting the delta value
    pan.setValue({ x:0, y:0 })

    // return () => pan.removeListener(listenerId)
  }, [])

  if (!panResponder) return null

  const showCardModal = () => {
    setModal(true)
  }

  const renderModal = () => {
    if (!showModal) return null
    return <CardModal card={props.card} navigation={props.navigation} onClose={() => setModal(false)}/>
  }

  const { color, card } = props
  const colorObj = tinycolor(color)
  const borderColor = {borderColor: colorObj.toHexString()}
  const panStyle = {
    transform: pan.getTranslateTransform()
  }
  return <Cell style={styles.cell} ref={cellRef}>
    {props.showLine ? <View style={[styles.coloredLine, borderColor]}/> : null}
    <Animated.View {...panResponder.panHandlers} style={[styles.cardBox, panStyle, borderColor]} elevation={5}>
      <View style={styles.cardInner}>
        <Text style={styles.cardText}>{card.title}</Text>
      </View>
      <TouchableOpacity onPress={showCardModal} style={styles.cardButton} hitSlop={{top: 20, bottom: 25, left: 25, right: 25}}>
        <Icon type="FontAwesome5" name='pen' style={{fontSize: 12}}/>
      </TouchableOpacity>
    </Animated.View>
    { renderModal() }
  </Cell>
}

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
  },
  coloredLine: {
    width: '100%',
    borderWidth: 1,
    position: 'absolute',
    top: 45,
  },
  cardBox: {
    position: 'absolute',
    left: 26, // 25 +1
    width: 125,
    height: 70,
    backgroundColor: 'hsl(210, 36%, 96%)', //gray-9
    borderWidth: 3,
    borderRadius: 4,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  cardInner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 125,
    paddingHorizontal: 2,
    paddingRight: 10,
  },
  cardText: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 14,
  },
  cardButton: {
    marginTop: 'auto',
    alignSelf: 'flex-end',
  },
})
