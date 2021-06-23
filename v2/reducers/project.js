import { SET_FILE_LIST, SELECT_FILE } from '../constants/ActionTypes'

const INITIAL_STATE = {
  fileList: [],
  selectedFile: null,
}

const projectReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_FILE_LIST:
      return {
        ...state,
        fileList: action.fileList,
      }
    case SELECT_FILE:
      return {
        ...state,
        selectedFile: action.selectedFile,
      }
    default:
      return state
  }
}

export default projectReducer
