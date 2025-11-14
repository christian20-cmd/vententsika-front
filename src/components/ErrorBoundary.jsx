import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      errorCount: 0
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('🚨 Error caught by boundary:', error);
    
    // Limiter les tentatives pour éviter les boucles infinies
    this.setState(prev => ({ 
      errorCount: prev.errorCount + 1 
    }));
  }

  resetError = () => {
    this.setState({ 
      hasError: false,
      errorCount: 0 
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  componentDidUpdate(prevProps) {
    // Réinitialiser l'erreur si les props changent
    if (this.state.hasError && prevProps.children !== this.props.children) {
      this.resetError();
    }
  }

  render() {
    if (this.state.hasError) {
      // Si trop d'erreurs, afficher un message simple
      if (this.state.errorCount > 2) {
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">Erreur d'affichage. Veuillez recharger la page.</p>
          </div>
        );
      }

      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-red-600 mr-2">⚠️</span>
            <p className="text-red-800 font-medium">Problème d'affichage temporaire</p>
          </div>
          <button 
            onClick={this.resetError}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;