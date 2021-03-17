import { jsx } from 'slate-hyperscript'
import DomParser from 'dom-parser'

const parser = new DomParser()

export default function HTMLToSlate (html) {
  const parsed = parser.parseFromString(`<div id="_body">${html}</div>`)
  const slate = parsed.getElementById('_body').childNodes.map(deserialize)
  if (Array.isArray(slate) && !slate.length) {
    slate.push({ type: 'paragraph', children: [{ text: '' }] })
  }
  return jsx('fragment', {}, slate)
}

export function deserialize (el) {
  if (el.nodeType === 3) {
    return { text: el.textContent }
  } else if (el.nodeType !== 1) {
    return null
  }
  const children = Array.from(el.childNodes)
    .map(deserialize)
    .flat()

  switch (el.nodeName) {
    case 'div':
      // if it's only child is a br
      if (el.childNodes.length == 1 && el.childNodes[0].nodeName == 'br') {
        return jsx('element', { type: 'paragraph' }, [{ text: '' }])
      }
      return jsx('element', { type: 'paragraph' }, children)
    // case 'br':
    //   return jsx('element', { type: 'paragraph' }, [{ text: '' }])
    case 'blockquote':
      return jsx('element', { type: 'block-quote' }, children)
    case 'p':
      return jsx('element', { type: 'paragraph' }, children)
    case 'h1':
    case 'h2':
      return jsx('element', { type: 'heading-one' }, children)
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
    case 'h7':
      return jsx('element', { type: 'heading-two' }, children)
    case 'ul':
      return jsx('element', { type: 'bulleted-list' }, children)
    case 'li':
      return jsx('element', { type: 'list-item' }, children)
    case 'ol':
      return jsx('element', { type: 'numbered-list' }, children)
    case 'em':
    case 'i':
      return jsx('text', { italic: true, text: el.textContent })
    case 'b':
    case 'strong':
      return jsx('text', { bold: true, text: el.textContent })
    case 'u':
      return jsx('text', { underline: true, text: el.textContent })
    case 'del':
      return jsx('text', { strike: true, text: el.textContent })
    case 'img':
      let childrenNodes =
        children && children.length ? children : [{ text: '' }]
      return jsx(
        'element',
        { type: 'image-link', url: el.getAttribute('src') },
        childrenNodes
      )
    case 'a':
      return jsx(
        'element',
        { type: 'link', url: el.getAttribute('href') },
        children
      )
    default:
      return { text: el.textContent }
  }
}
