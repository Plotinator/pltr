import timelineReducer from '../timelines'
import beatsReducer from '../beats'
import { newFileTimelines, newFileTimeline } from '../../store/newFileState'
import {
  ADD_HIERARCHY_LEVEL,
  ASSIGN_BEAT_TO_HIERARCHY,
  DELETE_HIERARCHY_LEVEL,
} from '../../constants/ActionTypes'
import { beat } from '../../store/initialState'

describe('timelineReducer', () => {
  describe('given no initial state', () => {
    describe('and any action which is not a timeline action', () => {
      it('should produce the initial file state', () => {
        expect(timelineReducer(undefined, { type: 'SOME_OTHER_TYPE' })).toEqual(newFileTimelines)
      })
    })
    describe('and the add action type', () => {
      describe('and the book id 1', () => {
        const action = { type: ADD_HIERARCHY_LEVEL, bookId: 1 }
        it('should enclose the current hierarchy in another level', () => {
          const newTimelineState = timelineReducer(undefined, action)
          expect(newTimelineState.hierarchy).toEqual(
            expect.arrayContaining({
              ...newFileTimeline,
              hierarchy: [
                {
                  level: 1,
                  beatIds: [3],
                  children: [newFileTimeline.hierarchy],
                },
              ],
            })
          )
        })
        it('the action should also create a corresponding beat', () => {
          const newBeatsState = beatsReducer(undefined, action)
          const newLevelBeat = {
            id: 3,
            bookId: 1,
            position: 1,
            title: 'auto',
            time: 0,
            templates: [],
            autoOutlineSort: true,
            fromTemplateId: null,
          }
          expect(newBeatsState).toEqual(expect.arrayContaining(newLevelBeat))
        })
      })
    })
    describe('and the delete action type', () => {
      describe('and the book id 1', () => {
        describe('and the hierarchy level of 0', () => {
          const action = { type: DELETE_HIERARCHY_LEVEL, bookId: 1 }
          it('should produce an empty hierarchy', () => {
            const newTimelineState = timelineReducer(undefined, action)
            expect(newTimelineState).toEqual(
              expect.arrayContaining({
                ...newFileTimeline,
                hierarchy: [],
              })
            )
          })
          it('should also delete the corresponding beats', () => {
            const newBeatsState = beatsReducer(undefined, action)
            expect(newBeatsState).not.toEqual(expect.arrayContaining(beat))
          })
        })
        describe('and the hierarchy level of 1', () => {
          const action = { type: DELETE_HIERARCHY_LEVEL, bookId: 1 }
          it('should leave the hierarchy unchanged', () => {
            const newTimelineState = timelineReducer(undefined, action)
            expect(newTimelineState).teEqual(newFileTimeline)
          })
          it('should also leave the beats alone', () => {
            const newBeatsState = beatsReducer(undefined, action)
            expect(newBeatsState).toEqual(expect.arrayContaining(beat))
          })
        })
      })
    })
    describe('and the assign action type', () => {
      describe('and the timeline id 2', () => {
        describe('and the beat id 4', () => {
          it('should add the beat id 4 to that hierarchy', () => {
            const action = { type: ASSIGN_BEAT_TO_HIERARCHY, timelineId: 1, beatId: 4 }
            const newTimelineState = timelineReducer(undefined, action)
            expect(newTimelineState).toEqual(
              expect.arrayContaining({
                ...newFileTimeline,
                hierarchy: [{ ...newFileTimeline.hierarchy[0], beatIds: [2, 4] }],
              })
            )
          })
        })
      })
    })
  })
  // Next: we need a hierarchy with two levels...
})