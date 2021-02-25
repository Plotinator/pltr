import { nextColor } from '../../v1/store/lineColors'
import { DASHED, DOTTED, nextBorderStyle, NONE, SOLID } from '../store/borderStyle'
import { hierarchyLevel } from '../store/initialState'

export const borderStyleToCss = (borderStyle) => {
  switch (borderStyle) {
    case NONE:
      return 'none'
    case DASHED:
      return 'dashed'
    case SOLID:
      return 'solid'
    case DOTTED:
      return 'dotted'
    default:
      return 'none'
  }
}

export const hierarchyToStyles = ({
  level,
  textColor,
  textSize,
  borderColor,
  borderStyle,
  backgroundColor,
}) => ({
  marginTop: `${level * 10}px`,
  padding: `${Math.floor((75 - textSize) / 2)}px 10px`,
  color: textColor,
  fontSize: `${textSize}px`,
  lineHeight: `${textSize}px`,
  border: `2px ${borderStyleToCss(borderStyle)} ${borderColor}`,
  backgroundColor,
})

export const newHierarchyLevel = (allHierarchyLevels) => {
  return {
    ...hierarchyLevel,
    level: allHierarchyLevels.length,
    textColor: nextColor(allHierarchyLevels.length),
    borderColor: nextColor(allHierarchyLevels.length),
    borderStyle: nextBorderStyle(allHierarchyLevels.length),
  }
}
