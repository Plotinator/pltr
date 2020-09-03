//ui actions
export const FILE_LOADED = 'FILE_LOADED'
export const FILE_SAVED = 'FILE_SAVED'
export const NEW_FILE = 'NEW_FILE'
export const CHANGE_CURRENT_VIEW = 'CHANGE_CURRENT_VIEW'
export const CHANGE_ORIENTATION = 'CHANGE_ORIENTATION'
export const CHANGE_CURRENT_TIMELINE = 'CHANGE_CURRENT_TIMELINE'
export const RESET = 'RESET'
export const SET_DARK_MODE = 'SET_DARK_MODE'
export const SET_CHARACTER_SORT = 'SET_CHARACTER_SORT'
export const SET_PLACE_SORT = 'SET_PLACE_SORT'
export const SET_NOTE_SORT = 'SET_PLACE_SORT'
export const SET_CHARACTER_FILTER = 'SET_CHARACTER_FILTER'
export const SET_PLACE_FILTER = 'SET_PLACE_FILTER'
export const SET_NOTE_FILTER = 'SET_PLACE_FILTER'
export const INCREASE_ZOOM = 'INCREASE_ZOOM'
export const DECREASE_ZOOM = 'DECREASE_ZOOM'
export const FIT_ZOOM = 'FIT_ZOOM'
export const RESET_ZOOM = 'RESET_ZOOM'
export const NAVIGATE_TO_BOOK_TIMELINE = 'NAVIGATE_TO_BOOK_TIMELINE'
export const EXPAND_TIMELINE = 'EXPAND_TIMELINE'
export const COLLAPSE_TIMELINE = 'COLLAPSE_TIMELINE'
export const SET_TIMELINE_FILTER = 'SET_TIMELINE_FILTER'
export const CLEAR_TEMPLATE_FROM_TIMELINE = 'CLEAR_TEMPLATE_FROM_TIMELINE'
export const RESET_TIMELINE = 'RESET_TIMELINE'

// scene actions
export const ADD_SCENE = 'ADD_SCENE'
export const EDIT_SCENE_TITLE = 'EDIT_SCENE_TITLE'
export const REORDER_SCENES = 'REORDER_SCENES'
export const DELETE_SCENE = 'DELETE_SCENE'

// beat actions
export const ADD_BEAT = 'ADD_BEAT'
export const EDIT_BEAT_TITLE = 'EDIT_BEAT_TITLE'
export const REORDER_BEATS = 'REORDER_BEATS'
export const DELETE_BEAT = 'DELETE_BEAT'

// card actions
export const ADD_CARD = 'ADD_CARD'
export const EDIT_CARD_DETAILS = 'EDIT_CARD_DETAILS'
export const EDIT_CARD_COORDINATES = 'EDIT_CARD_COORDINATES'
export const DELETE_CARD = 'DELETE_CARD'
export const CHANGE_LINE = 'CHANGE_STORYLINE'
export const CHANGE_SCENE = 'CHANGE_SCENE'
export const CHANGE_BOOK = 'CHANGE_BOOK'

export const ATTACH_CHARACTER_TO_CARD = 'ATTACH_CHARACTER_TO_CARD'
export const ATTACH_PLACE_TO_CARD = 'ATTACH_PLACE_TO_CARD'
export const ATTACH_TAG_TO_CARD = 'ATTACH_TAG_TO_CARD'
export const REMOVE_CHARACTER_FROM_CARD = 'REMOVE_CHARACTER_FROM_CARD'
export const REMOVE_PLACE_FROM_CARD = 'REMOVE_PLACE_FROM_CARD'
export const REMOVE_TAG_FROM_CARD = 'REMOVE_TAG_FROM_CARD'

// line actions
export const ADD_LINE = 'ADD_STORYLINE'
export const ADD_LINES_FROM_TEMPLATE = 'ADD_LINES_FROM_TEMPLATE'
export const EDIT_LINE_TITLE = 'EDIT_STORYLINE_TITLE'
export const EDIT_LINE_COLOR = 'EDIT_STORYLINE_COLOR'
export const REORDER_LINES = 'REORDER_STORYLINES'
export const DELETE_LINE = 'DELETE_STORYLINE'

// series line actions
export const ADD_SERIES_LINE = 'ADD_SERIES_LINE'
export const ADD_SERIES_LINES_FROM_TEMPLATE = 'ADD_SERIES_LINES_FROM_TEMPLATE'
export const EDIT_SERIES_LINE_TITLE = 'EDIT_SERIES_LINE_TITLE'
export const EDIT_SERIES_LINE_COLOR = 'EDIT_SERIES_LINE_COLOR'
export const REORDER_SERIES_LINES = 'REORDER_SERIES_LINES'
export const DELETE_SERIES_LINE = 'DELETE_SERIES_LINE'

// places actions
export const ADD_PLACE = 'ADD_PLACE'
export const ADD_PLACE_WITH_VALUES = 'ADD_PLACE_WITH_VALUES'
export const EDIT_PLACE = 'EDIT_PLACE'
export const DELETE_PLACE = 'DELETE_PLACE'
export const ATTACH_TAG_TO_PLACE = 'ATTACH_TAG_TO_PLACE'
export const ATTACH_BOOK_TO_PLACE = 'ATTACH_BOOK_TO_PLACE'
export const REMOVE_TAG_FROM_PLACE = 'REMOVE_TAG_FROM_PLACE'
export const REMOVE_BOOK_FROM_PLACE = 'REMOVE_BOOK_FROM_PLACE'

// tags actions
export const ADD_TAG = 'ADD_TAG'
export const ADD_TAG_WITH_VALUES = 'ADD_TAG_WITH_VALUES'
export const EDIT_TAG = 'EDIT_TAG'
export const DELETE_TAG = 'DELETE_TAG'

// characters actions
export const ADD_CHARACTER = 'ADD_CHARACTER'
export const ADD_CHARACTER_WITH_TEMPLATE = 'ADD_CHARACTER_WITH_TEMPLATE'
export const ADD_CHARACTER_WITH_VALUES = 'ADD_CHARACTER_WITH_VALUES'
export const EDIT_CHARACTER = 'EDIT_CHARACTER'
export const DELETE_CHARACTER = 'DELETE_CHARACTER'
export const ATTACH_TAG_TO_CHARACTER = 'ATTACH_TAG_TO_CHARACTER'
export const ATTACH_BOOK_TO_CHARACTER = 'ATTACH_BOOK_TO_CHARACTER'
export const REMOVE_TAG_FROM_CHARACTER = 'REMOVE_TAG_FROM_CHARACTER'
export const REMOVE_BOOK_FROM_CHARACTER = 'REMOVE_BOOK_FROM_CHARACTER'

// notes actions
export const ADD_NOTE = 'ADD_NOTE'
export const EDIT_NOTE = 'EDIT_NOTE'
export const DELETE_NOTE = 'DELETE_NOTE'

export const ATTACH_CHARACTER_TO_NOTE = 'ATTACH_CHARACTER_TO_NOTE'
export const ATTACH_PLACE_TO_NOTE = 'ATTACH_PLACE_TO_NOTE'
export const ATTACH_TAG_TO_NOTE = 'ATTACH_TAG_TO_NOTE'
export const ATTACH_BOOK_TO_NOTE = 'ATTACH_BOOK_TO_NOTE'
export const REMOVE_CHARACTER_FROM_NOTE = 'REMOVE_CHARACTER_FROM_NOTE'
export const REMOVE_PLACE_FROM_NOTE = 'REMOVE_PLACE_FROM_NOTE'
export const REMOVE_TAG_FROM_NOTE = 'REMOVE_TAG_FROM_NOTE'
export const REMOVE_BOOK_FROM_NOTE = 'REMOVE_BOOK_FROM_NOTE'

// custom attribute actions
export const ADD_CHARACTER_ATTRIBUTE = 'ADD_CHARACTER_ATTRIBUTE'
export const ADD_PLACES_ATTRIBUTE = 'ADD_PLACES_ATTRIBUTE'
export const ADD_CARDS_ATTRIBUTE = 'ADD_CARDS_ATTRIBUTE'
export const ADD_LINES_ATTRIBUTE = 'ADD_LINES_ATTRIBUTE'
export const ADD_SCENES_ATTRIBUTE = 'ADD_SCENES_ATTRIBUTE'

export const REMOVE_CHARACTER_ATTRIBUTE = 'REMOVE_CHARACTER_ATTRIBUTE'
export const REMOVE_PLACES_ATTRIBUTE = 'REMOVE_PLACES_ATTRIBUTE'
export const REMOVE_CARDS_ATTRIBUTE = 'REMOVE_CARDS_ATTRIBUTE'
export const REMOVE_LINES_ATTRIBUTE = 'REMOVE_LINES_ATTRIBUTE'
export const REMOVE_SCENES_ATTRIBUTE = 'REMOVE_SCENES_ATTRIBUTE'

export const EDIT_CHARACTER_ATTRIBUTE = 'EDIT_CHARACTER_ATTRIBUTE'
export const EDIT_PLACES_ATTRIBUTE = 'EDIT_PLACES_ATTRIBUTE'
export const EDIT_CARDS_ATTRIBUTE = 'EDIT_CARDS_ATTRIBUTE'
export const EDIT_LINES_ATTRIBUTE = 'EDIT_LINES_ATTRIBUTE'
export const EDIT_SCENES_ATTRIBUTE = 'EDIT_SCENES_ATTRIBUTE'

// image actions
export const ADD_IMAGE = 'ADD_IMAGE'
export const RENAME_IMAGE = 'RENAME_IMAGE'
export const DELETE_IMAGE = 'DELETE_IMAGE'

// series actions
export const EDIT_SERIES = 'EDIT_SERIES'

// book actions
export const ADD_BOOK = 'ADD_BOOK'
export const EDIT_BOOK = 'EDIT_BOOK'
export const DELETE_BOOK = 'DELETE_BOOK'
export const REORDER_BOOKS = 'REORDER_BOOKS'
