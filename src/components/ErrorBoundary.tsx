import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected application error occurred.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application boundary caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F6F8FB] flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-3xl bg-white p-7 border border-slate-200 shadow-lg text-center space-y-4">
            <h1 className="font-display font-extrabold text-xl text-[#0F1E36]">
              Unable to Render Screen
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">{this.state.errorMessage}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-xl bg-[#164A91] hover:bg-[#0F3468] text-white font-display font-bold text-sm cursor-pointer"
            >
              Reload App Demo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
