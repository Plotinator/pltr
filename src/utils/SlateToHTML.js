export default function SlateToHTML (slate) {
  let HTML = ``
  if (typeof slate === 'object') {
    slate.map(obj => {
      console.log('SLATE OBJECT', obj)
      switch (obj.type) {
        case 'heading-one':
          HTML += `<h1>${obj.text}</h1>\n`
          break
        case 'heading-two':
          HTML += `<h2>${obj.text}</h2>\n`
          break
        case 'link':
          HTML += `<a href="${obj.url}">${obj.text}</a>\n`
          break
        case 'image-link':
          HTML += `<img src="${obj.url}"/>\n`
          break
        case 'list-item':
          HTML += `<li>${obj.text}</li>\n`
          break
        case 'numbered-list':
          HTML += `<ol>${SlateToHTML(obj.children)}</ol>\n`
          break
        case 'bulleted-list':
          HTML += `<ul>${SlateToHTML(obj.children)}</ul>\n`
          break
        default:
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
  const { text, strike, bold, strong, paragraph, underline, italic } = slate
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
  if (paragraph) {
    HTML = `<p>${HTML}</p>`
  }
  return HTML
}
