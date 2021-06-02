import {
  ADD_CHARACTER_CATEGORY,
  DELETE_CHARACTER_CATEGORY,
  UPDATE_CHARACTER_CATEGORY,
  REORDER_CHARACTER_CATEGORY,
  ADD_NOTE_CATEGORY,
  DELETE_NOTE_CATEGORY,
  UPDATE_NOTE_CATEGORY,
  REORDER_NOTE_CATEGORY,
} from '../constants/ActionTypes'

export function addCharacterCategory(name) {
  return {
    type: ADD_CHARACTER_CATEGORY,
    name,
  }
}

export function deleteCharacterCategory(category) {
  return {
    type: DELETE_CHARACTER_CATEGORY,
    category,
  }
}

export function updateCharacterCategory(category) {
  return {
    type: UPDATE_CHARACTER_CATEGORY,
    category,
  }
}

export function reorderCharacterCategory(category, toIndex) {
  return {
    type: REORDER_CHARACTER_CATEGORY,
    category,
    toIndex,
  }
}

export function addNoteCategory(name) {
  return {
    type: ADD_NOTE_CATEGORY,
    name,
  }
}

export function deleteNoteCategory(category) {
  return {
    type: DELETE_NOTE_CATEGORY,
    category,
  }
}

export function updateNoteCategory(category) {
  return {
    type: UPDATE_NOTE_CATEGORY,
    category,
  }
}

export function reorderNoteCategory(category, toIndex) {
  return {
    type: REORDER_NOTE_CATEGORY,
    category,
    toIndex,
  }
}
