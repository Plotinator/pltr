import { FILE_LOADED, NEW_FILE, RESET, EDIT_BOOK, ADD_BOOK, DELETE_BOOK, REORDER_BOOKS } from '../constants/ActionTypes'
import { book as defaultBook } from '../store/initialState'
import { newFileBooks } from '../../../shared/newFileState'
import { objectId } from '../store/newIds'

export default function books (state = defaultBook, action) {
  switch (action.type) {
    case EDIT_BOOK:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          ...action.attributes,
        }
      }

    case ADD_BOOK:
      const newId = objectId(state.allIds)
      return {
        ...state,
        allIds: [
          ...state.allIds,
          newId,
        ],
        [newId]: {
          ...action.book,
          id: newId,
        }
      }

    case REORDER_BOOKS:
      return {
        ...state,
        allIds: action.ids,
      }

    case DELETE_BOOK:
      const newIds = [...state.allIds]
      newIds.splice(newIds.indexOf(action.id), 1)
      return state.allIds.reduce((acc, id) => {
        if (id != action.id) {
          acc[id] = state[id]
        }
        return acc
      }, {allIds: newIds})

    case RESET:
    case FILE_LOADED:
      return action.data.books

    case NEW_FILE:
      return newFileBooks

    default:
      return state
  }
}