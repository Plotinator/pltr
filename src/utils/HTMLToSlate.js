import { jsx } from 'slate-hyperscript'
import DomParser from 'dom-parser'

const parser = new DomParser()

export default function HTMLToSlate (html) {
  const parsed = parser.parseFromString(`<div id="_body">${html}</div>`)
  const slate = deserialize(parsed.getElementById('_body'))
  if (!slate.length) {
    slate.push({ type: 'paragraph', children: [{ text: '' }] })
  }
  return slate
}

export function deserialize (el) {
  console.log('nodeType', el.nodeType)
  if (el.nodeType === 3) {
    // if it's only a bunch of white space, ignore it
    if (
      el.textContent == '\n' ||
      el.textContent == '\n\n' ||
      el.textContent == '\n\n\n'
    ) {
      return null
    }
    return { text: el.textContent.replace(/[\n]/g, ' ') }
  } else if (el.nodeType !== 1) {
    return null
  }
  const children = Array.from(el.childNodes)
    .map(deserialize)
    .flat()

  switch (el.nodeName) {
    case 'div':
      return jsx('fragment', {}, children)
    case 'br':
      return jsx('element', { type: 'paragraph' }, [{ text: '' }])
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
      console.log('ululul', children)
      return jsx('element', { type: 'bulleted-list' }, children)
    case 'li':
      console.log('li', children)
      return jsx('element', { type: 'list-item' }, children)
    case 'ol':
      console.log('ol', children)
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
