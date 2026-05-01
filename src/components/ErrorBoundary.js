import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

const CHUNK_RELOAD_KEY = 'libastrack_chunk_reload';

/* Animated error illustration */
function ErrorIllustration() {
  return (
    <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 24px' }}>
      {/* Glowing background orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, transparent 70%)',
        }}
      />
      
      {/* Main icon container */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        style={{
          position: 'absolute',
          inset: 20,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
          border: '2px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <AlertTriangle size={36} style={{ color: '#ef4444' }} />
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -15, 0],
            x: [0, i % 2 === 0 ? 5 : -5, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2.5 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
          style={{
            position: 'absolute',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#ef4444',
            top: 10 + i * 25,
            right: i % 2 === 0 ? 5 : undefined,
            left: i % 2 !== 0 ? 5 : undefined,
          }}
        />
      ))}
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Unhandled UI error:', error, errorInfo);

    const message = `${error?.name || ''} ${error?.message || ''}`.toLowerCase();
    const isChunkLoadError =
      message.includes('chunkloaderror') ||
      message.includes('loading chunk') ||
      message.includes('failed to fetch dynamically imported module');

    if (isChunkLoadError) {
      const alreadyRetried = window.sessionStorage.getItem(CHUNK_RELOAD_KEY) === 'true';

      if (!alreadyRetried) {
        window.sessionStorage.setItem(CHUNK_RELOAD_KEY, 'true');
        window.location.reload();
        return;
      }
    }
  }

  handleReload = () => {
    window.sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    window.location.reload();
  };

  handleGoBack = () => {
    window.history.back();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError && window.sessionStorage.getItem(CHUNK_RELOAD_KEY) === 'true') {
      window.sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    }

    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-void)',
          padding: 24,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background noise texture */}
          <div 
            className="tm-noise" 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              opacity: 0.03, 
              pointerEvents: 'none' 
            }} 
          />

          {/* Gradient orbs */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '50vw',
              height: '50vw',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 60%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              maxWidth: 480,
              width: '100%',
              padding: 40,
              textAlign: 'center',
              background: 'rgba(30, 41, 59, 0.60)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4)',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Top gradient line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: 'linear-gradient(90deg, transparent, #ef4444, transparent)',
              borderRadius: '24px 24px 0 0',
            }} />

            <ErrorIllustration />

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 4vw, 1.8rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
              }}
            >
              Something went wrong
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                marginTop: 12,
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
              }}
            >
              We encountered an unexpected issue while loading this page.
              Don&apos;t worry, your data is safe.
            </motion.p>

            {/* Error details (collapsible in dev) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <motion.details
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  marginTop: 20,
                  padding: 16,
                  background: 'rgba(239, 68, 68, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  textAlign: 'left',
                }}
              >
                <summary style={{
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#ef4444',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  Error Details
                </summary>
                <pre style={{
                  marginTop: 12,
                  fontSize: '0.7rem',
                  color: 'var(--text-faint)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  maxHeight: 120,
                  overflow: 'auto',
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </motion.details>
            )}

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                marginTop: 28,
              }}
            >
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 12px 32px rgba(6, 182, 212, 0.25)' }}
                whileTap={{ scale: 0.98 }}
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '14px 28px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(6, 182, 212, 0.35)',
                  transition: 'all 0.3s ease',
                }}
              >
                <RefreshCw size={18} />
                Reload Page
              </motion.button>

              <div style={{ display: 'flex', gap: 12 }}>
                <motion.button
                  whileHover={{ scale: 1.02, background: 'var(--bg-layer2)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={this.handleGoBack}
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-layer1)',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <ArrowLeft size={16} />
                  Go Back
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, background: 'var(--bg-layer2)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={this.handleGoHome}
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-layer1)',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Home size={16} />
                  Home
                </motion.button>
              </div>
            </motion.div>

            {/* Help text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                marginTop: 24,
                fontSize: '0.75rem',
                color: 'var(--text-faint)',
              }}
            >
              If this problem persists, please contact support.
            </motion.p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
