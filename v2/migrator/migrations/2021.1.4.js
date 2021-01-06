const { cloneDeep } = require('lodash')

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
  const obj = cloneDeep(data);

  // cards
  obj.cards.forEach(card => card.description = fixRCE(card.description))

  // nodes
  obj.notes.forEach(note => note.content = fixRCE(note.content))

  // characters
  const characterParagraphAttributes = [
    'notes',
    ...obj.customAttributes.characters.filter(attr => attr.type === 'paragraph')
  ]
  obj.characters.forEach(character => {
    characterParagraphAttributes.forEach(attr => character[attr] = fixRCE(character[attr]))
    character.templates.forEach(template => {
      template.attributes
        .filter(attribute => attribute.type === 'paragraph')
        .forEach(attribute => attribute.value = fixRCE(attribute.value))
    })
  })

  // places
  const placesParagraphAttributes = [
    'notes',
    ...obj.customAttributes.places.filter(attr => attr.type === 'paragraph')
  ]
  obj.places.forEach(place => {
    placesParagraphAttributes.forEach(attr => place[attr] = fixRCE(place[attr]))
  })

  return obj
}

module.exports = migrate
