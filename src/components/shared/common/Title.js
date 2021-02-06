import React from 'react'
import Text from './Text'
import t from 'format-message'

const Title = ({ title }) => {
  return (
    <Text fontStyle={'bold'} color={null}>
      {title}
    </Text>
  )
}

export const RenderTitle = name => <Title title={t(name)} />

export default Title
