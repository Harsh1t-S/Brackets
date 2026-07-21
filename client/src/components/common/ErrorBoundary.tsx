import { Component, type ErrorInfo, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render-time errors (and lazy-chunk load failures) anywhere below it
 * so a single throw shows a recoverable fallback instead of a blank screen.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught UI error:", error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-2xl font-bold text-ink">Something went wrong</h1>
          <p className="max-w-md text-ink-muted">
            An unexpected error occurred. Reloading the page usually fixes it.
          </p>
          <button
            onClick={this.handleReload}
            className="btn btn-primary px-5 py-2.5"
          >
            <RotateCcw size={16} /> Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
