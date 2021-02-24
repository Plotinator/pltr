import { useRef, useEffect } from 'react'

export function useRegisterCoordinates (registerFN, beatId, lineId, isBlank, positionWithinLine, title) {
  const cellRef = useRef(null)

  useEffect(() => {
    // report x,y coordinates to timeline
    if (cellRef.current?._root) {
      measure()
    } else {
      setTimeout(() => measure(), 0)
    }
  }, [cellRef, beatId, lineId])

  const measure = () => {
    if (positionWithinLine != 0) return // only register the first scene position in each stack

    const root = isBlank ? cellRef.current : cellRef.current?._root
    if (root) {
      root.measure((x, y, width, height, px, py) => {
        if (!px || !py) return
        registerFN({x: px, y: py, beatId, lineId, isBlank, title})
      })
    }
  }

  return [cellRef, measure]
}
