import {
  FILE_LOADED,
  FILE_SAVED,
  NEW_FILE,
  RESET,
  EDIT_FILENAME,
  LOAD_FILE,
} from '../constants/ActionTypes'
import { file as defaultFile } from '../store/initialState'

const file =
  (dataRepairers) =>
  (state = defaultFile, action) => {
    switch (action.type) {
      case FILE_LOADED:
        return {
          fileName: action.fileName,
          loaded: true,
          dirty: action.dirty,
          version: action.version,
          appliedMigrations: action.data.file.appliedMigrations,
          initialVersion: action.data.file.initialVersion,
        }

      case FILE_SAVED:
        return Object.assign({}, state, { dirty: false })

      case NEW_FILE:
        return { fileName: action.fileName, loaded: true, dirty: false, version: action.version }

      case EDIT_FILENAME:
        return Object.assign({}, state, { fileName: action.newName })

      case RESET:
        return Object.assign({}, action.data.file, { dirty: true })

      case LOAD_FILE:
        return action.file

      default:
        return Object.assign({}, state, { dirty: true })
    }
  }

export default file
