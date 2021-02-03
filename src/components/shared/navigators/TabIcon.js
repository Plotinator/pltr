import React from 'react'
import { Icon } from 'native-base'
import styles from './TabStyles'

export function chooseIcon(routeName) {
  switch (routeName) {
    case 'Project':
      return ['book', 25]
    case 'Timeline':
      return ['grip-horizontal', 30]
    case 'Outline':
      return ['stream', 24]
    case 'Notes':
      return ['sticky-note', 25]
    case 'Characters':
      return ['users', 25]
    case 'Places':
      return ['globe-americas', 26]
    case 'Tags':
      return ['tags', 24]
    default:
      break
  }
}

export default ({ focused, color, size, route }) => {
  const [iconName, iconSize] = chooseIcon(route.name)
  return (
    <Icon
      type='FontAwesome5'
      active={focused}
      name={iconName}
      style={[{ fontSize: iconSize || size, color: color }, styles.tabIcon]}
    />
  )
}
