import React, { useState, useEffect } from 'react'
import PropTypes from 'react-proptypes'
import { StyleSheet, TouchableHighlight } from 'react-native'
import { View, Text, Button } from 'native-base'
import { helpers } from 'pltr/v2'
import cx from 'classnames'
import tinycolor from 'tinycolor2'

function MiniChapter (props) {
  const { chapter, idx, cards, linesById, sortedLines, positionOffset } = props
  const [sortedCards, setSortedCards] = useState([])

  useEffect(
    () => {
      setSortedCards(
        helpers.card.sortCardsInBeat(
          chapter.autoOutlineSort,
          cards,
          sortedLines
        )
      )
    },
    [chapter, cards]
  )

  const findCard = card => {
    let id = card.lineId
    return linesById[id]
  }

  const renderCardDots = () => {
    return sortedCards.map(c => {
      let line = findCard(c)
      if (!line) return null

      const colorObj = tinycolor(line.color)

      let style = { backgroundColor: colorObj.toHexString() }
      return <View key={`dot-${line.id}-${c.id}`} style={[styles.dot, style]} />
    })
  }

  return (
    <TouchableHighlight onPress={props.onPress}>
      <View style={styles.container}>
        <View style={[styles.container, styles.chapterWrapper]}>
          <Text style={styles.indexText}>{`${idx + 1}.  `}</Text>
          <Text style={styles.titleText}>
            {helpers.beats.beatTitle(chapter, positionOffset)}
          </Text>
        </View>
        <View style={[styles.container, styles.dotWrapper]}>
          {renderCardDots()}
        </View>
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  chapterWrapper: {
    paddingVertical: 6
  },
  indexText: {
    color: 'hsl(210, 83%, 53%)' // blue-5
  },
  titleText: {},
  dotWrapper: {
    marginLeft: 'auto'
  },
  dot: {
    height: 10,
    width: 10,
    marginHorizontal: 2
  }
})

MiniChapter.propTypes = {
  chapter: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  cards: PropTypes.array.isRequired,
  sortedLines: PropTypes.array.isRequired,
  linesById: PropTypes.object.isRequired,
  positionOffset: PropTypes.number.isRequired
}

export default MiniChapter
