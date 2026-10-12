import { Component, ReactNode } from 'react';
import { ctaClass } from '@/lib/cta';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
          <p className="font-serif text-2xl text-foreground">
            Une erreur est survenue
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Vous pouvez recharger la page pour reprendre la navigation.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className={ctaClass(false, 'mt-8')}
          >
            Recharger la page
            <span aria-hidden="true">→</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
