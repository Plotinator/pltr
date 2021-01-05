function fixRCE(richContent) {
  if (!richContent) return richContent
  // Rich content can sometimes just be a string
  if (typeof richContent === 'string') return richContent
  // rich content that needs to be fixed is an array
  if (Array.isArray(richContent) === false) return richContent

  walkRichContentTree(richContent, (object) => {
    // if it's a text node it won't have any children
    if (Array.isArray(object.children) == false) return

    if (object.children.length === 0) {
      object.children = [{ text: '' }]
    }
  })

  return richContent
}

function walkRichContentTree(richContent, callback) {
  richContent.forEach(o => {
    callback(o)
    if (Array.isArray(o.children)) {
      walkRichContentTree(o.children, callback)
    }
  })
}

function migrate(data) {
  // cards
  data.cards.forEach(card => card.description = fixRCE(card.description))

  // nodes
  data.notes.forEach(note => note.content = fixRCE(note.content))

  // characters
  const characterParagraphAttributes = [
    'notes',
    ...data.customAttributes.characters.filter(attr => attr.type === 'paragraph')
  ]
  data.characters.forEach(character => {
    characterParagraphAttributes.forEach(attr => character[attr] = fixRCE(character[attr]))
  })

  // places
  const placesParagraphAttributes = [
    'notes',
    ...data.customAttributes.places.filter(attr => attr.type === 'paragraph')
  ]
  data.places.forEach(place => {
    placesParagraphAttributes.forEach(attr => place[attr] = fixRCE(place[attr]))
  })

  return data
}

module.exports = migrate
