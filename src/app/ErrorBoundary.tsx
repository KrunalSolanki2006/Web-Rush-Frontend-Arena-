import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="bg-slip border border-rule p-6 md:p-8 max-w-md w-full rounded-sm shadow-md text-center perforated-edge">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-stamp-red/10 text-stamp-red flex items-center justify-center border border-stamp-red/20">
              <AlertTriangle size={24} aria-hidden="true" />
            </div>

            <div className="font-mono text-xs uppercase tracking-widest text-stamp-red font-bold mb-1">
              Ledger Error
            </div>
            <h1 className="font-display text-xl font-bold text-ink mb-2">
              Something broke in the ledger
            </h1>
            <p className="font-sans text-xs text-ink-soft mb-6 leading-relaxed">
              {this.state.error?.message || 'An unexpected rendering error occurred while computing life receipts.'}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-ink text-paper font-mono text-xs uppercase font-bold tracking-wider rounded-xs hover:bg-ink-soft transition-colors"
            >
              <RefreshCw size={14} aria-hidden="true" />
              <span>Reload Ledger</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
