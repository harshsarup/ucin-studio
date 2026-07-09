import { Component, type ReactNode } from 'react'

/**
 * Last-resort error boundary — a runtime error anywhere in a route must show a
 * friendly recovery screen, never a blank page. State in localStorage survives,
 * so reloading loses nothing.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error('[ucin] route crashed:', error)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="display text-2xl text-fg">Something went wrong.</h1>
        <p className="max-w-md text-[15px] text-fg-subtle">
          The page hit an unexpected error. Your work is safe — uploads resume from where they
          stopped, and jobs keep running on the network.
        </p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Reload
        </button>
      </div>
    )
  }
}
