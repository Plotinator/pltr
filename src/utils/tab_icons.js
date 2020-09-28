
export function chooseIcon (routeName) {
  switch (routeName) {
    case 'Project':
      return 'book'
    case 'Timeline':
      return 'table'
    case 'Outline':
      return 'stream'
    case 'Notes':
      return 'sticky-note'
    case 'Characters':
      return 'users'
    case 'Places':
      return 'globe-americas'
    case 'Tags':
      return 'tags'
    default:
      break
  }
}

export const tabBarOptions = {
  activeTintColor: '#ff7f32',
  keyboardHidesTabBar: true,
}