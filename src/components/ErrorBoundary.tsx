import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh", background: "#f8f9fa" }}>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h1 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>Something went wrong</h1>
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>Please refresh the page to continue.</p>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: "8px 16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
