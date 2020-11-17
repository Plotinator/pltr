import React from 'react'
import ErrorBoundary from '../../shared/ErrorBoundary'

export default function withBoundary(WrappedComponent) {
  return function BoundaryWrapped (props) {
    return <ErrorBoundary>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  }
}
