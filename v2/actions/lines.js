import {
  ADD_LINE,
  ADD_LINE_WITH_TITLE,
  ADD_LINES_FROM_TEMPLATE,
  EDIT_LINE,
  EDIT_LINE_TITLE,
  EDIT_LINE_COLOR,
  REORDER_LINES,
  DELETE_LINE,
} from '../constants/ActionTypes'

export function addLine(bookId) {
  return { type: ADD_LINE, bookId }
}

export function addLineWithTitle(title, bookId) {
  return { type: ADD_LINE_WITH_TITLE, title, bookId }
}

export function addLinesFromTemplate(cards, lines, chapters, bookId, template) {
  return { type: ADD_LINES_FROM_TEMPLATE, cards, lines, chapters, bookId, template }
}

export function editLine(id, title, color) {
  return { type: EDIT_LINE, id, title, color }
}

export function editLineTitle(id, title) {
  return { type: EDIT_LINE_TITLE, id, title }
}

export function editLineColor(id, color) {
  return { type: EDIT_LINE_COLOR, id, color }
}

export function reorderLines(lines, bookId) {
  return { type: REORDER_LINES, lines, bookId }
}

export function deleteLine(id, bookId) {
  return { type: DELETE_LINE, id, bookId }
}