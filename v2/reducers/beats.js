import {
  ADD_LINES_FROM_TEMPLATE,
  ADD_BEAT,
  AUTO_SORT_BEAT,
  CLEAR_TEMPLATE_FROM_TIMELINE,
  DELETE_BEAT,
  EDIT_BEAT_TITLE,
  FILE_LOADED,
  NEW_FILE,
  REORDER_BEATS,
  REORDER_CARDS_IN_BEAT,
  RESET,
  RESET_TIMELINE,
  DELETE_BOOK,
  INSERT_BEAT,
  COLLAPSE_BEAT,
  EXPAND_BEAT,
} from '../constants/ActionTypes'
import { beat as defaultBeat } from '../store/initialState'
import { newFileBeats } from '../store/newFileState'
import { positionReset, nextPositionInBook, moveNextToSibling } from '../helpers/beats'
import { associateWithBroadestScope } from '../helpers/lines'
import { partition } from 'lodash'
import { addNode, deleteNode, editNode, nodeParent, filter, newTree, findNode } from './tree'
import { nextId } from '../helpers/beats'

// bookId is:
// Union of:
//  - bookId: Number,
//  - "series": String literal,

const INITIAL_STATE = [defaultBeat]

const add = addNode('id')

const addNodeToState = (state, bookId, position, title, parentId) => {
  const node = {
    autoOutlineSort: true,
    bookId: bookId,
    fromTemplateId: null,
    id: nextId(state),
    position,
    time: 0,
    title: title,
    expanded: true,
  }
  return {
    ...state,
    [bookId]: add(state[bookId], parentId, node),
  }
}

export default function beats(state = INITIAL_STATE, action) {
  const actionBookId = associateWithBroadestScope(action.bookId)

  switch (action.type) {
    case ADD_BEAT: {
      // If we don't get a parent id then make this a root node
      const parentId = action.parentId || null
      const position = nextPositionInBook(state, actionBookId, parentId)
      return addNodeToState(state, actionBookId, position, action.title, parentId)
    }

    case ADD_LINES_FROM_TEMPLATE: {
      return {
        ...state,
        [actionBookId]: action.beats.reduce(
          (acc, nextBeat) => add(acc, null, nextBeat),
          state[actionBookId]
        ),
      }
    }

    case EDIT_BEAT_TITLE:
      return {
        ...state,
        [actionBookId]: editNode(state[actionBookId], action.id, { title: action.title }),
      }

    case DELETE_BOOK:
      return state.filter(({ bookId }) => bookId !== action.id)

    case DELETE_BEAT: {
      return {
        ...state,
        [actionBookId]: positionReset(deleteNode(state[actionBookId], action.id)),
      }
    }

    case REORDER_BEATS:
      return {
        ...state,
        [actionBookId]: moveNextToSibling(
          state[actionBookId],
          action.beatId,
          action.beatDroppedOnto
        ),
      }

    case INSERT_BEAT: {
      if (!action.peerBeatId) {
        const newState = addNodeToState(state, actionBookId, -0.5, 'auto', null)
        return {
          ...newState,
          [actionBookId]: positionReset(newState[actionBookId]),
        }
      }
      // If we don't get a parent id then make this a root node
      const parentId = nodeParent(state[actionBookId], action.peerBeatId) || null
      const position = findNode(state[actionBookId], action.peerBeatId).position + 0.5
      const node = {
        autoOutlineSort: true,
        bookId: actionBookId,
        fromTemplateId: null,
        id: nextId(state),
        // Will be reset by `moveNextToSibling'
        position,
        time: 0,
        title: 'auto',
      }
      const newState = add(state[actionBookId], parentId, node)
      return {
        ...state,
        [actionBookId]: positionReset(newState),
      }
    }

    case REORDER_CARDS_IN_BEAT:
      return {
        ...state,
        [actionBookId]: editNode(state[actionBookId], action.beatId, { autoOutlineSort: false }),
      }

    case AUTO_SORT_BEAT:
      return {
        ...state,
        [actionBookId]: editNode(state[actionBookId], action.id, { autoOutlineSort: true }),
      }

    case CLEAR_TEMPLATE_FROM_TIMELINE: {
      return {
        ...state,
        [actionBookId]: positionReset(
          filter(state[actionBookId], ({ fromTemplateId }) => fromTemplateId !== action.templateId)
        ),
      }
    }

    case RESET_TIMELINE: {
      const withBeatsRemoved = {
        ...state,
        [actionBookId]: newTree('id'),
      }
      const newNode = {
        id: nextId(withBeatsRemoved),
        bookId: actionBookId,
        position: 0,
        title: 'auto',
        time: 0,
        autoOutlineSort: true,
        fromTemplateId: null,
      }
      return {
        ...withBeatsRemoved,
        [actionBookId]: add(withBeatsRemoved[actionBookId], null, newNode),
      }
    }

    case COLLAPSE_BEAT:
      return {
        ...state,
        [actionBookId]: editNode(state[actionBookId], action.id, { expanded: false }),
      }

    case EXPAND_BEAT:
      return {
        ...state,
        [actionBookId]: editNode(state[actionBookId], action.id, { expanded: true }),
      }

    case RESET:
    case FILE_LOADED:
      return action.data.beats

    case NEW_FILE:
      return newFileBeats

    default:
      return state
  }
}
