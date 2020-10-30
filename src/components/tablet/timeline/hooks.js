import { useRef, useEffect } from 'react'

export function useRegisterCoordinates (registerFN, chapterId, lineId, isBlank, positionWithinLine, title) {
  const cellRef = useRef(null)

  useEffect(() => {
    // report x,y coordinates to timeline
    if (cellRef.current?._root) {
      measure()
    } else {
      setTimeout(() => measure(), 0)
    }
  }, [cellRef, chapterId, lineId])

  const measure = () => {
    if (positionWithinLine != 0) return // only register the first scene position in each stack

    const root = isBlank ? cellRef.current : cellRef.current?._root
    if (root) {
      root.measure((x, y, width, height, px, py) => {
        if (!px || !py) return
        registerFN({x: px, y: py, chapterId, lineId, isBlank, title})
      })
    }
  }

  return [cellRef, measure]
}