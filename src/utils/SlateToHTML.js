export default function SlateToHTML (slate) {
  let HTML = ''
  if (typeof slate === 'object') {
    slate.map(obj => {
      switch (obj.type) {
        case 'heading-one':
          HTML += `<h1>${SlateToHTML(obj.children)}</h1>`
          break
        case 'heading-two':
          HTML += `<h2>${SlateToHTML(obj.children)}</h2>`
          break
        case 'link':
          HTML += `<a href="${obj.url}">${SlateToHTML(obj.children)}</a>`
          break
        case 'image-link':
          HTML += `<img src="${obj.url}"/>`
          break
        case 'list-item':
          HTML += `<li>${SlateToHTML(obj.children)}</li>`
          break
        case 'paragraph':
          HTML += `<p>${SlateToHTML(obj.children)}</p>\n`
          break
        case 'numbered-list':
          HTML += `<ol>${SlateToHTML(obj.children)}</ol>`
          break
        case 'bulleted-list':
          HTML += `<ul>${SlateToHTML(obj.children)}</ul>`
          break
        case 'paragraph':
          HTML += `<div>${SlateToHTML(obj.children)}</div>`
          break
        default:
          if (obj.text == '') {
            HTML += '<div><br/></div>'
          }
          if (obj.text || typeof obj === 'string') {
            HTML += SlateTextToHTML(obj)
          }
          if (obj.children) {
            HTML += SlateToHTML(obj.children)
          }
          break
      }
    })
    return HTML
  }
}

export function SlateTextToHTML (slate) {
  const { text, strike, bold, strong, underline, italic } = slate
  const HTMLText = typeof slate === 'string' ? slate : text
  let HTML = `<span>${HTMLText}</span>`
  if (bold || strong) {
    HTML = `<strong>${HTML}</strong>`
  }
  if (italic) {
    HTML = `<em>${HTML}</em>`
  }
  if (underline) {
    HTML = `<u>${HTML}</u>`
  }
  if (strike) {
    HTML = `<del>${HTML}</del>`
  }
  return HTML
}
