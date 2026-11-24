import React from 'react';

/**
 * Captura errores de la interfaz. En la raíz muestra una pantalla para recargar;
 * alrededor de un modal (`onReset`), solo cierra ese modal y deja el resto de la página funcionando.
 */
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

  reset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.onReset) {
      return (
        <div className="modal-error" role="alert">
          <p>No se pudo abrir esta ventana.</p>
          <button type="button" onClick={this.reset}>Cerrar</button>
        </div>
      );
    }
    return (
      <div className="error-boundary" role="alert">
        <h2>Algo salió mal</h2>
        <p>Ocurrió un error inesperado al mostrar Atlas MX. Recarga la página para intentarlo de nuevo.</p>
        <button type="button" onClick={() => window.location.reload()}>Recargar</button>
      </div>
    );
  }
}
