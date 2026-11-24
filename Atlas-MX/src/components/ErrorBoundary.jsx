import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[Atlas MX] Error inesperado en la interfaz.', error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="error-boundary" role="alert">
        <h2>Algo salió mal</h2>
        <p>Ocurrió un error inesperado al mostrar Atlas MX. Puedes recargar la página para intentarlo de nuevo.</p>
        <button type="button" onClick={() => window.location.reload()}>Recargar</button>
      </div>
    );
  }
}
