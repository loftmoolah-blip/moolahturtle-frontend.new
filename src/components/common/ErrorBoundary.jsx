import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Better error logging
    console.group('ErrorBoundary caught an error');
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    console.error('Component stack:', errorInfo?.componentStack);
    console.error('Full error object:', error);
    console.error('Full errorInfo object:', errorInfo);
    console.groupEnd();
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      // Better error display
      const errorMessage = this.state.error?.message || 'An unknown error occurred';
      const errorName = this.state.error?.name || 'Error';
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-red-800">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              
              {isDevelopment && this.state.error && (
                <details className="text-left bg-gray-100 p-4 rounded text-sm overflow-auto max-h-48">
                  <summary className="cursor-pointer font-medium text-red-700 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <div className="space-y-2">
                    <p><strong>Error Type:</strong> {errorName}</p>
                    <p><strong>Message:</strong> {errorMessage}</p>
                    {this.state.error?.stack && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="text-xs text-red-600 mt-1 whitespace-pre-wrap">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="text-xs text-red-600 mt-1 whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
              
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
                <Button 
                  onClick={this.handleRetry}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Try Again
                </Button>
              </div>
              
              {this.state.retryCount > 2 && (
                <p className="text-sm text-gray-500">
                  If this problem persists, please contact support.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;