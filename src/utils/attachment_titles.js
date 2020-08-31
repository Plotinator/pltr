import i18n from 'format-message'

export function attachmentHeaderTitles (type) {
  switch (type) {
    case 'characters':
      return i18n('Attach Characters')
    case 'places':
      return i18n('Attach Places')
    case 'tags':
      return i18n('Attach Tags')
    case 'books':
    case 'bookIds':
      return i18n('Attach Books')
  }
}

export function attachmentItemText (type) {
  switch (type) {
    case 'characters':
      return i18n('Characters')
    case 'places':
      return i18n('Places')
    case 'tags':
      return i18n('Tags')
    case 'books':
    case 'bookIds':
      return i18n('Books')
  }
}